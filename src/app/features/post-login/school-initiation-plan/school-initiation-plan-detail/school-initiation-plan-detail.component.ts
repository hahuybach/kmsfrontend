import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiationplanService } from 'src/app/services/initiationplan.service';
import { switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-white-space.validator';
import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { TuiDay } from '@taiga-ui/cdk';
import {
  dateToTuiDay,
  tuiDayCalendarToDate,
  tuiDayToDate,
  unSub,
} from 'src/app/shared/util/util';
@Component({
  selector: 'app-school-initiation-plan-detail',
  templateUrl: './school-initiation-plan-detail.component.html',
  styleUrls: ['./school-initiation-plan-detail.component.scss'],
})
export class SchoolInitiationPlanDetailComponent implements OnInit, OnDestroy {
  // uploadedFiles: any[] = [];
  schoolinitiationplan: any;
  docHistoryVisible = false;
  uploadFileVisible = false;
  resetDeadlineVisible = false;
  newFile: any;
  fileStatus = false;
  iconStatus = true;
  buttonApproveStatus = false;
  minDate: TuiDay;
  today: Date = new Date();
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  initiationplanId: number;
  lastDocs: any;
  isFormNull = true;
  isLoading = false;
  submitCompleted = false;
  isFileLoading = false;
  pdfPreviewVisibility: boolean = false;
  newDeadlineValue: TuiDay = dateToTuiDay(new Date());
  sub: any[];
  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách kế hoạch thực hiện',
      routerLink: '/school-initiation-plan/list',
    },
    {
      caption: 'Chi tiết kế hoạch thực hiện',
    },
  ];

  ngOnInit(): void {
    console.log('on init ' + this.auth.getJwtFromCookie());
    this.minDate = dateToTuiDay(new Date());
    const method = this.route.params
      .pipe(
        switchMap((params) => {
          this.initiationplanId = +params['id'];
          console.log(this.initiationplanId);
          return this.initiationplanService.getInitiationPlanById(
            this.initiationplanId
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.schoolinitiationplan = data;
          console.log(this.schoolinitiationplan);
          this.lastDocs =
            this.schoolinitiationplan?.documents[
            this.schoolinitiationplan?.documents?.length - 1
              ];
          console.log(this.lastDocs);
        },
        error: (error) => {

        }
        }

        );
    this.sub.push(method);
  }

  selectedFilename: any;
  fileInputPlaceholders: string;
  selectedOption: string;
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
    protected http: HttpClient,
    private auth: AuthService,
    private toastService: ToastService
  ) {}
  initData() {
    const method = this.initiationplanService
      .getInitiationPlanById(this.initiationplanId)
      .subscribe((data) => {
        this.schoolinitiationplan = data;
        console.log(this.schoolinitiationplan);
        this.lastDocs =
          this.schoolinitiationplan.documents[
            this.schoolinitiationplan.documents.length - 1
          ];
        console.log(this.lastDocs);
      });
    this.sub.push(method);
  }
  inputFileForm = this.fb.group({
    documentName: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(256),
        NoWhitespaceValidator(),
      ]),
    ],
    documentCode: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(256),
        NoWhitespaceValidator(),
      ]),
    ],
    documentTypeId: 4,
    deadline: [this.today, Validators.required],
    isPasssed: [false, Validators.required],
    file: ['', Validators.required],
  });
  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      6: 'info',
      7: 'warning',
      8: 'success',
      9: 'danger',
    };

    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }

  deleteFile() {
    this.fileStatus = false;
    this.buttonApproveStatus = false;
    this.inputFileForm.reset();
    this.fileInputPlaceholders = '';
  }
  approve() {
    if (this.inputFileForm.invalid) {
      this.inputFileForm.markAllAsTouched();
    } else {
      this.confirmationService.confirm({
        message: 'Bạn có chắc chắn phê duyệt kế hoạch này?',
        header: 'Xác nhận phê duyệt',
        // icon: 'bi bi-exclamation-triangle-fill',
        key: 'confirmSchoolInitiationplan',
        accept: () => {
          this.uploadFileVisible = false;
          this.resetDeadlineVisible = false;
          this.isLoading = true;
          this.inputFileForm.get('isPasssed')?.setValue(true);
          const formData = new FormData();
          const initiationplan = {
            initiationPlanId: this.schoolinitiationplan.initiationPlanId,
            isPassed: true,
            deadline: null,
            departmentDocument: {
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
          //
          console.log('before approve ' + this.auth.getJwtFromCookie());

          const method = this.initiationplanService
            .putEvaluateSchoolDoc(formData)
            .subscribe({
              next: (response) => {
                console.log('Form data sent to the backend:', response);
                console.log('after approve ' + this.auth.getJwtFromCookie());

                // this.messageService.add({
                //   severity: 'success',
                //   summary: 'Phê duyệt',
                //   detail: 'Đã phê duyệt thành công',
                // });
                this.submitCompleted = true;
                setTimeout(() => {
                  this.initData();
                }, 1500);
                setTimeout(() => {
                  this.isLoading = false;
                }, 1500);
                this.uploadFileVisible = false;
              },
              error: (error) => {
                this.toastService.showError(
                  'toastSchoolIni',
                  'Có lỗi xảy ra',
                  error.error.message
                );
                this.isLoading = false;
              },
            });
          this.sub.push(method);
        },
        reject: (type: any) => {},
      });
    }
  }
  // checkFormNull(): Boolean {
  //   return (
  //     this.inputFileForm.get('file')?.value == '' ||
  //     this.inputFileForm.controls.documentName.errors?.['whitespace'] ||
  //     this.inputFileForm.controls.documentCode.errors?.['whitespace']
  //   );
  // }
  reject() {
    if (this.inputFileForm.invalid) {
      this.inputFileForm.markAllAsTouched();
    } else {
      this.resetDeadlineVisible = true;
    }
    console.log(this.resetDeadlineVisible);
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
    }
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.inputFileForm.get('file')?.setValue(file);
      this.fileInputPlaceholders = file.name;
    }
    // this.fileStatus = true;
    this.buttonApproveStatus = true;
  }
  resetDeadline() {
    let newDeadline = this.inputFileForm.get('deadline')?.value;
    let formattedDeadline = this.datePipe.transform(newDeadline, 'dd/MM/yyyy');

    console.log();
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn không phê duyệt kế hoạch này và thay đổi lịch sang ngày ' +
        formattedDeadline +
        '?',
      header: 'Xác nhận không phê duyệt',
      icon: 'bi bi-exclamation-triangle-fill',
      key: 'confirmSchoolInitiationplan',
      accept: () => {
        newDeadline?.setDate(newDeadline?.getDate());
        console.log(this.setDateTimeToISO(newDeadline));
        this.uploadFileVisible = false;
        this.resetDeadlineVisible = false;
        this.isLoading = true;
        const formData = new FormData();
        const initiationplan = {
          initiationPlanId: this.schoolinitiationplan.initiationPlanId,
          isPassed: false,
          deadline: this.inputFileForm.get('deadline')?.value,
          departmentDocument: {
            documentName: this.inputFileForm.get('documentName')?.value,
            documentCode: this.inputFileForm.get('documentCode')?.value,
          },
        };
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
        console.log('before submit deadline ' + this.auth.getJwtFromCookie());

        const method = this.initiationplanService
          .putEvaluateSchoolDoc(formData)
          .subscribe({
            next: (response) => {
              this.submitCompleted = true;
              setTimeout(() => {
                this.initData();
              }, 1500);
              setTimeout(() => {
                this.isLoading = false;
              }, 1500);
            },
            error: (error) => {
              this.toastService.showError(
                'toastSchoolIni',
                'Có lỗi xảy ra',
                error.error.message
              );
              this.isLoading = false;
            },
          });
        this.sub.push(method);
      },
      reject: (type: any) => {},
    });
  }
  displayNewFileUpload(file: File) {
    const blobUrl = window.URL.createObjectURL(file as Blob);
    this.pdfUrl = blobUrl;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.pdfLoaded = true;
  }
  openNewTab(documentLink: string) {
    this.pdfPreviewVisibility = true;
    console.log(documentLink);
    const method = this.fileService
      .readInitiationplanPDF(documentLink)
      .subscribe((response) => {
        const blobUrl = window.URL.createObjectURL(response.body as Blob);
        this.pdfUrl = blobUrl;
        this.safePdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.pdfLoaded = true;
      });
    this.sub.push(method);
  }
  redirectToIssue() {
    // const url = '/issuelist/' + this.initiationplan.issueId;
    this.router.navigateByUrl('/issuelist/1');
  }
  hideUploadPopup() {
    this.inputFileForm.reset(this.inputFileForm.value);
  }
  onHideFilePreviewEvent() {
    this.pdfUrl = '';
    this.safePdfUrl = '';
    this.pdfLoaded = false;
  }
  setDateTimeToISO(date: Date | null | undefined) {
    if (date) {
      // Set the time to 23:59:59
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);

      // Convert the date to local ISO string format (Vietnam time zone)
      // const options = { timeZone: 'Asia/Ho_Chi_Minh' };
      const isoString = date.toISOString();

      return isoString;
    }
    // Set the time to 23:59:59
    return '';
  }
  onDayClick(day: TuiDay): void {
    this.newDeadlineValue = day;
    console.log(tuiDayCalendarToDate(day));
    this.inputFileForm.get('deadline')?.setValue(tuiDayCalendarToDate(day));
  }
  ngOnDestroy(): void {
    console.log(this.sub);
    unSub(this.sub);
  }
}
