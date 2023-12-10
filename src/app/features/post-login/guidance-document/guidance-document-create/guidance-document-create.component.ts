import {Component, OnDestroy, OnInit} from '@angular/core';
import {GuidanceDocumentService} from '../../../../services/guidance-document.service';
import {IssueService} from '../../../../services/issue.service';
import {
    FormArray,
    FormBuilder,
    FormControl,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Observer, switchMap} from 'rxjs';
import {IssueResponse} from '../../../../models/issue-response';
import {ToastService} from '../../../../shared/toast/toast.service';
import {DocumentService} from '../../../../services/document.service';
import {ConfirmationService, ConfirmEventType} from 'primeng/api';
import {NoWhitespaceValidator} from "../../../../shared/validators/no-white-space.validator";
import {unSub} from "../../../../shared/util/util";

@Component({
    selector: 'app-guidance-document-create',
    templateUrl: './guidance-document-create.component.html',
    styleUrls: ['./guidance-document-create.component.scss'],
})
export class GuidanceDocumentCreateComponent implements OnInit, OnDestroy {

    guidanceForm = this.fb.group({
        issueId: [''],
        guidanceDocumentName: ['', [Validators.required, NoWhitespaceValidator(), Validators.maxLength(254)]],
        description: ['', [Validators.required, Validators.maxLength(999), NoWhitespaceValidator()]],
        guidanceDocuments: this.fb.array([]),
    });
    isSubmitted: boolean = false;
    selectedFiles: any[];
    isLoading: boolean = false;
    isFileAllSubmit = true;
    issue: IssueResponse;
    submitCompleted: boolean = false;
    fileInputPlaceholders: string[] = [];
    subs: any[] = [];

  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách văn bản bổ sung',
      routerLink: '/guidance-document/list',
    },
    {
      caption: 'Tạo mới văn bản bổ sung'
    },
  ];

    constructor(
        private guidanceService: GuidanceDocumentService,
        private issueService: IssueService,
        private fb: FormBuilder,
        private activateRoute: ActivatedRoute,
        private route: Router,
        private toast: ToastService,
        private documentService: DocumentService,
        private confirmationService: ConfirmationService
    ) {
    }

    get guidanceDocuments() {
        return this.guidanceForm.controls['guidanceDocuments'] as FormArray;
    }

    addGuidanceDocument() {
        const guidanceDocumentForm = this.fb.group({
            documentName: ['', [Validators.required, NoWhitespaceValidator(), Validators.maxLength(254)]],
            documentCode: ['', [Validators.required, NoWhitespaceValidator(),Validators.maxLength(254)]],
            isExist: [false],
        });
        this.guidanceDocuments.push(guidanceDocumentForm);
    }

    ngOnInit(): void {
        this.activateRoute.params
            .pipe(
                switchMap((params) => {
                    console.log(params['issueId']);
                    return params['issueId'];
                })
            )
            .subscribe((data: any) => {
                this.guidanceForm.patchValue({
                    issueId: data,
                });
            });
        this.addGuidanceDocument();
        console.log(this.guidanceForm.value);
     const sub =    this.issueService
            .getIssueById(
                Number.parseInt(this.guidanceForm.get('issueId')?.value ?? '')
            )
            .subscribe({
                next: (result) => {
                    this.issue = result.issue;
                },
                error: (error) => {
                    console.log(error);
                },
            });
     this.subs.push(sub);
    }

    onSubmit() {
        this.isSubmitted = true;

        this.checkIfFileHasSubmit();
        if (!this.isFileAllSubmit) {
            this.isFileAllSubmit = true;
            return;
        }
        console.log(this.guidanceForm.value, this.guidanceForm.invalid);
        if (!this.guidanceForm.invalid) {
            this.isLoading = true;

          const sub =  this.guidanceService
                .saveGuidanceDocument(this.guidanceForm.value, this.selectedFiles)
                .subscribe({
                    next: (result) => {
                        this.submitCompleted = true;
                        setTimeout(() => {
                            this.route.navigate([
                                'guidanceDocument/' +
                                result.guidanceDocumentDto.guidanceDocumentId,
                            ]);
                        }, 1500);
                    },
                    error: (error) => {
                        this.toast.showWarn('toastGuidanceDocumentCreate', 'Lỗi', error.error.message);
                        this.isLoading = false;
                        console.log(error);
                    },
                });
          this.subs.push(sub);
        }
    }

    isBlank(field: string): boolean | undefined {
        return (
            this.guidanceForm.get(field)?.invalid &&
            ((this.guidanceForm.get(field)?.dirty ?? false) ||
                (this.guidanceForm.get(field)?.touched ?? false) ||
                this.isSubmitted)
        );
    }

    isError(field: string, errorCode: string): boolean | undefined {
        return (
            this.guidanceForm.get(field)?.hasError(errorCode) &&
            ((this.guidanceForm.get(field)?.dirty ?? false) ||
                (this.guidanceForm.get(field)?.touched ?? false))
        );
    }


    isBlankForGuidanceDocuments(field: string, index: number) {
        return (
            (this.guidanceDocuments.at(index).get(field)?.hasError('required') || this.guidanceDocuments.at(index).get(field)?.hasError('whitespace')) &&
            ((this.guidanceDocuments.at(index).get(field)?.dirty ?? false) ||
                (this.guidanceDocuments.at(index).get(field)?.touched ?? false) ||
                this.isSubmitted)
        );
    }

    isMaxLengthForGuidanceDocuments(field: string, index: number) {
        return (
            this.guidanceDocuments.at(index).get(field)?.hasError('maxlength')
        );
    }

    // isDuplicateForGuidanceDocuments(index: number) {
    //   console.log(this.guidanceDocuments.at(index).get('documentCode')?.hasError('documentCodeExist'));
    //   return (
    //     this.guidanceDocuments.at(index).get('documentCode')?.hasError('documentCodeExist') &&
    //     ((this.guidanceDocuments.at(index).get('documentCode')?.dirty ?? false) ||
    //       (this.guidanceDocuments.at(index).get('documentCode')?.touched ?? false) || this.isSubmitted)
    //   );
    // }

    removeGuidanceDocument(index: number) {
        this.guidanceDocuments.removeAt(index);
        if (this.selectedFiles) {
            this.selectedFiles.splice(index, 1);
        }
        console.log(this.selectedFiles);
    }

    onSubmitFile(event: any, index: number) {
        if (!this.selectedFiles) {
            this.selectedFiles = []; // Initialize the selectedFiles array if it's not already defined
        }
        const file = event.target.files[0];
        if (file.type === 'application/pdf') {
            // Check if the file type is PDF
            this.selectedFiles[index] = file;
            this.fileInputPlaceholders[index] = file.name;
            this.guidanceDocuments.at(index).patchValue({
                isExist: false,
            });
        } else {
            // Handle error or provide feedback to the user
            this.toast.showWarn(
                'toastGuidanceDocumentCreate',
                'Lỗi',
                'Văn bản chỉ đạo phải ở dưới định dạng pdf'
            );
            event.target.value = null;
        }
    }

    checkValidFile(index: number) {
        return this.guidanceDocuments.at(index).get('isExist');
    }

    checkIfFileHasSubmit() {
        for (let i = 0; i < this.guidanceDocuments.length; i++) {
            if (!this.selectedFiles || !this.selectedFiles[i]) {
                this.guidanceDocuments.at(i).patchValue({
                    isExist: true,
                });
                this.isFileAllSubmit = false;
            }
        }
    }

    isDuplicateDocumentCode(documentCode: any, index: number): any {
        for (let i = 0; i < this.guidanceDocuments.length; i++) {
            if (index == i) {
                continue;
            }
            if (
                this.guidanceDocuments.at(i).get('documentCode')?.value ==
                documentCode.valueOf().toString()
            ) {
                return !this.guidanceDocuments.at(index).get('documentCode')?.invalid;
            }
        }
        return false;
    }

    documentCodeValidator = (formControl: FormControl) => {
        console.log('validator  ');
        console.log(formControl.value);
        this.documentService.checkIfDocumentCodeExist(formControl.value).subscribe({
            next: (result) => {
                return {documentCodeExist: result};
            },
        });
    };

    confirm() {
        this.confirmationService.confirm({
            message: 'Bạn có xác nhận yêu cầu này không?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Có',
            rejectLabel: 'Không',
            key: 'confirmGuidanceDocumentCreate',
            accept: () => {
                this.onSubmit();
            },
        });
    }

    check(field: any, form: any) {
        return (form.get(field)?.hasError('required') || form.get(field)?.hasError('whitespace')) &&
            ((form.get(field)?.dirty ?? false) ||
                (form.get(field)?.touched ?? false) || this.isSubmitted)
    }
    ngOnDestroy(): void {
        unSub(this.subs)
    }
}
