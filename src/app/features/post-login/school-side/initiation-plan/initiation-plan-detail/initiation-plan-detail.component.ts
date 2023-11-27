import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { InitiationplanService } from 'src/app/services/initiationplan.service';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-white-space.validator';

@Component({
  selector: 'app-initiation-plan-detail',
  templateUrl: './initiation-plan-detail.component.html',
  styleUrls: ['./initiation-plan-detail.component.scss'],
})
export class InitiationPlanDetailComponent implements OnInit {
  schoolinitiationplan: any;
  docHistoryVisible = false;
  uploadFileVisible = false;
  resetDeadlineVisible = false;
  newFile: any;
  fileStatus = false;
  iconStatus = false;
  buttonApproveStatus = false;
  minDate: Date;
  today: Date = new Date();
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  initiationplanId: number;
  lastDocs: any;
  fileInputPlaceholders: string;
  isDelete = false;
  isLoading = false;
  submitCompleted = false;
  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.initiationplanId = +params['id'];
          console.log(this.initiationplanId);
          return this.initiationplanService.getInitiationPlanById(
            this.initiationplanId
          );
        })
      )
      .subscribe((data) => {
        this.schoolinitiationplan = data;
        console.log(this.schoolinitiationplan);

        // this.lastDocs = {
        //   schoolDocument:
        //     this.schoolinitiationplan.documents[
        //       this.schoolinitiationplan.documents.length - 1
        //     ].schoolDocument,
        //   departmentDocument:
        //     this.schoolinitiationplan.documents[
        //       this.schoolinitiationplan.documents.length - 2
        //     ].departmentDocument,
        // };

        if (
          this.schoolinitiationplan.documents.length >= 2 &&
          this.schoolinitiationplan.status.statusId == 7
        ) {
          this.lastDocs = {
            schoolDocument:
              this.schoolinitiationplan.documents[
                this.schoolinitiationplan.documents.length - 1
              ].schoolDocument,
            departmentDocument:
              this.schoolinitiationplan.documents[
                this.schoolinitiationplan.documents.length - 2
              ].departmentDocument,
          };
        } else {
          this.lastDocs =
            this.schoolinitiationplan.documents[
              this.schoolinitiationplan.documents.length - 1
            ];
        }
        if (
          this.lastDocs.schoolDocument != null &&
          this.schoolinitiationplan.status.statusId != 9
        ) {
          this.fileStatus = true;
        }
      });
  }
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private initiationplanService: InitiationplanService,
    private route: ActivatedRoute,
    protected http: HttpClient
  ) {}
  inputFileForm = this.fb.group({
    documentName: ['', NoWhitespaceValidator()],
    documentCode: ['', NoWhitespaceValidator()],
    documentTypeId: 4,
    // deadline: [this.today, Validators.required],
    isPasssed: [false, Validators.required],
    file: ['', Validators.required],
  });
  initData() {
    this.initiationplanService
      .getInitiationPlanById(this.initiationplanId)
      .subscribe((data) => {
        this.schoolinitiationplan = data;
        console.log(this.schoolinitiationplan);
        if (
          this.schoolinitiationplan.documents.length >= 2 &&
          this.schoolinitiationplan.status.statusId == 7
        ) {
          this.lastDocs = {
            schoolDocument:
              this.schoolinitiationplan.documents[
                this.schoolinitiationplan.documents.length - 1
              ].schoolDocument,
            departmentDocument:
              this.schoolinitiationplan.documents[
                this.schoolinitiationplan.documents.length - 2
              ].departmentDocument,
          };
        } else {
          this.lastDocs =
            this.schoolinitiationplan.documents[
              this.schoolinitiationplan.documents.length - 1
            ];
        }
        if (
          this.lastDocs.schoolDocument != null &&
          this.schoolinitiationplan.status.statusId != 9
        ) {
          this.fileStatus = true;
        }
      });
  }
  displayNewFileUpload(file: File) {
    const blobUrl = window.URL.createObjectURL(file as Blob);
    this.pdfUrl = blobUrl;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.pdfLoaded = true;
  }
  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.fileService
      .readInitiationplanPDF(documentLink)
      .subscribe((response) => {
        const blobUrl = window.URL.createObjectURL(response.body as Blob);
        this.pdfUrl = blobUrl;
        this.safePdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.pdfLoaded = true;
      });
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.inputFileForm.get('file')?.setValue(file);
      this.fileInputPlaceholders = file.name;
    }
  }
  upload() {
    console.log(this.inputFileForm.value);
    this.uploadFileVisible = false;
    this.fileStatus = true;
    this.buttonApproveStatus = true;
    this.schoolinitiationplan.documents.departmentDocument = '';
    const fileControl = this.inputFileForm.get('file');
    if (fileControl?.value) {
      this.newFile = fileControl.value;
      console.log(this.newFile);
    }
  }
  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      6: 'info',
      7: 'warning',
      8: 'success',
      9: 'danger',
    };

    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }
  redirectToIssue() {
    this.router.navigateByUrl('/issuelist/1');
  }
  deleteFile() {
    this.confirmationService.confirm({
      header: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa tài liệu?',
      key: 'confirmInitiationplan',
      accept: () => {
        this.fileStatus = false;
        this.inputFileForm.reset();
        this.fileInputPlaceholders = '';
        this.buttonApproveStatus = false;
        this.isDelete = true;
      },
    });
    // console.log(123);
    // this.inputFileForm.get('documentName')?.setValue('');
    // this.inputFileForm.get('documentCode')?.setValue('');
    // this.inputFileForm.get('file')?.setValue('');
  }
  confirmUpload() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn nộp tài liệu?',
      header: 'Xác nhận phê duyệt',
      icon: 'bi bi-exclamation-triangle-fill',
      key: 'confirmInitiationplan',
      accept: () => {
        this.isLoading = true;
        if (this.inputFileForm.get('file')?.value) {
          this.inputFileForm.get('isPasssed')?.setValue(true);
          const formData = new FormData();
          const initiationplan = {
            initiationPlanId: this.schoolinitiationplan.initiationPlanId,
            schoolDocuments: {
              documentName: this.inputFileForm.get('documentName')?.value,
              documentCode: this.inputFileForm.get('documentCode')?.value,
            },
          };
          console.log(initiationplan);
          formData.append(
            'initiation_plan',
            new Blob([JSON.stringify(initiationplan)], {
              type: 'application/json',
            })
          );
          const fileControl = this.inputFileForm.get('file');
          if (fileControl?.value) {
            const pdfFile = fileControl.value;
            formData.append('files', pdfFile);
          }
          this.initiationplanService.putUploadSchoolDoc(formData).subscribe({
            next: (response) => {
              console.log('Form data sent to the backend:', response);
              this.submitCompleted = true;
              setTimeout(() => {
                this.initData();
              }, 1500);
              setTimeout(() => {
                this.isLoading = false;
              }, 1500);
            },
            error: (error) => {
              console.log(error);
            },
          });
        } else {
          this.submitCompleted = true;
          setTimeout(() => {
            this.initData();
            this.iconStatus = false;
            this.isLoading = false;
          }, 1500);
        }

        // const headers = new HttpHeaders();
        // headers.append('Content-Type', 'undefined');
        // this.http
        //   .put(
        //     'http://localhost:8080/api/v1/initiation_plan/upload_school_document',
        //     formData,
        //     { headers }
        //   )
        //   .subscribe(
        //     (response) => {
        //       console.log('Form data sent to the backend:', response);
        //       this.messageService.add({
        //         severity: 'success',
        //         summary: 'Phê duyệt',
        //         detail: 'Phê duyệt thành công',
        //       });
        //       window.location.reload();
        //     },
        //     (error) => {
        //       console.error('Error while sending form data:', error);
        //     }
        //   );
      },
      reject: (type: any) => {},
    });
  }
  visibleIcon() {
    this.iconStatus = true;
  }
  hideUploadPopup() {
    this.inputFileForm.reset(this.inputFileForm.value);
  }
  checkCanEdit() {
    const deadline = new Date(this.schoolinitiationplan.deadline);
    return Date.now() <= deadline.getTime();
  }
  getSize(size: number): string {
    const n: number = 1024;
    let s: string = '';
    const kb: number = size / n;
    const mb: number = kb / n;
    const gb: number = mb / n;
    const tb: number = gb / n;

    if (size < n) {
      s = size + ' Bytes';
    } else if (size >= n && size < n * n) {
      s = kb.toFixed(1) + ' KB';
    } else if (size >= n * n && size < n * n * n) {
      s = mb.toFixed(1) + ' MB';
    } else if (size >= n * n * n && size < n * n * n * n) {
      s = gb.toFixed(2) + ' GB';
    } else if (size >= n * n * n * n) {
      s = tb.toFixed(2) + ' TB';
    }

    return s;
  }
}
