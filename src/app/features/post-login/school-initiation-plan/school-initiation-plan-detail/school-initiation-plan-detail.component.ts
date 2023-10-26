import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-school-initiation-plan-detail',
  templateUrl: './school-initiation-plan-detail.component.html',
  styleUrls: ['./school-initiation-plan-detail.component.scss'],
})
export class SchoolInitiationPlanDetailComponent implements OnInit {
  uploadedFiles: any[] = [];
  schoolinitiationplan: any;
  docHistoryVisible = false;
  uploadFileVisible = false;
  resetDeadlineVisible = false;
  file: File;
  fileStatus = false;
  iconStatus = true;
  minDate: Date;
  today: Date = new Date();
  ngOnInit(): void {
    this.minDate = new Date();
    this.schoolinitiationplan = {
      initiationPlanId: 1,
      initiationPLanName:
        'Kế hoạch thực hiện nhiệm vụ năm học năm 2023 trường Ánh Sao',
      deadline: '2023-10-26T02:36:28',
      createdDate: '2023-10-26T02:36:41.529556',
      createdBy: 'Trần Lê Hải',
      status: {
        statusId: 2,
        statusName: 'Chờ phê duyệt',
        statusType: 'Kế hoạch thực hiện năm học',
      },
      school: {
        schoolId: 1,
        schoolName: 'Ánh Sao',
        exactAddress: '123 Cầu Giấy',
      },
      issueId: 1,
      documents: [
        {
          id: 1,
          schoolDocument: {
            documentId: 4,
            documentName: 'School Doc1',
            account: {
              accountId: 7,
              email: 'hieutruong@gmail.com',
              user: {
                userId: 7,
                fullName: 'Hiệu Thị Trưởng',
                dob: '1999-03-01',
                gender: 'MALE',
                phoneNumber: '0394335205',
              },
              school: {
                schoolId: 1,
                schoolName: 'Ánh Sao',
                exactAddress: '123 Cầu Giấy',
              },
            },
            documentCode: 'DOC001',
            documentLink: '1q_NtIqhLI1tP4g19h9dC-4R8LSIWMRG7',
            uploadedDate: '2023-10-26T02:36:53.89875',
            size: 617677,
            status: {
              statusId: 2,
              statusName: 'Mất hiệu lực',
              statusType: 'Chung',
            },
            sizeFormat: null,
            documentTypeId: 4,
          },
          departmentDocument: null,
        },
      ],
    };
  }

  selectedFilename: any;
  fileInputPlaceholders: string;
  // dropdownOptions: any[] = [
  //   { label: 'Phê duyệt', value: '3', severity: 'success' },
  //   { label: 'Không phê duyệt', value: '4', severity: 'danger' },
  // ];
  selectedOption: string;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}
  inputFileForm = this.fb.group({
    documentName: ['', Validators.required],
    documentCode: ['', Validators.required],
    documentTypeId: 4,
    deadline: [this.today, Validators.required],
    isPasssed: [false, Validators.required],
    file: [''],
  });
  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      1: 'info',
      2: 'warning',
      3: 'success',
      4: 'danger',
    };

    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }
  deleteFile() {
    this.fileStatus = false;
    this.inputFileForm.get('documentName')?.setValue('');
    this.inputFileForm.get('documentCode')?.setValue('');
    this.inputFileForm.get('file')?.setValue('');
    this.fileInputPlaceholders = '';
  }
  approve() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn phê duyệt kế hoạch này?',
      header: 'Xác nhận phê duyệt',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        this.schoolinitiationplan.status.statusId = 3;
        this.schoolinitiationplan.status.statusName = 'Phê duyệt';
        this.inputFileForm.get('isPasssed')?.setValue(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Phê duyệt',
          detail: 'Phê duyệt thành công',
        });
      },
      reject: (type: any) => {
        // switch (type) {
        //   case ConfirmEventType.REJECT:
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'Hủy',
        //       detail: 'You have rejected',
        //     });
        //     break;
        //   case ConfirmEventType.CANCEL:
        //     this.messageService.add({
        //       severity: 'warn',
        //       summary: 'Cancelled',
        //       detail: 'You have cancelled',
        //     });
        //     break;
        //   default:
        //     // Handle other cases, if necessary
        //     break;
        // }
      },
    });
    this.schoolinitiationplan.status.statusId = 3;
    this.schoolinitiationplan.status.statusName = 'Phê duyệt';
    console.log(this.schoolinitiationplan.status.statusId);
  }
  reject() {
    console.log(1234);
    this.resetDeadlineVisible = true;
    console.log(this.resetDeadlineVisible);
  }
  upload() {
    console.log(this.inputFileForm.value);
    this.uploadFileVisible = false;
    this.fileStatus = true;
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.inputFileForm.get('file')?.setValue(file);
      this.fileInputPlaceholders = file.name;
    }
  }
  resetDeadline() {
    let newDeadline = this.inputFileForm.get('deadline')?.value;
    let formattedDeadline = this.datePipe.transform(newDeadline, 'dd/MM/yyyy');
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn không phê duyệt kế hoạch này và thay đổi lịch sang ngày ' +
        formattedDeadline +
        '?',
      header: 'Xác nhận không phê duyệt',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        this.schoolinitiationplan.status.statusId = 4;
        this.schoolinitiationplan.status.statusName = 'Không phê duyệt';
        this.resetDeadlineVisible = false;
        this.fileStatus = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Đã gửi đánh giá',
          detail: 'Đã gửi đánh giá thành công',
        });
      },
      reject: (type: any) => {
        // switch (type) {
        //   case ConfirmEventType.REJECT:
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'Rejected',
        //       detail: 'You have rejected',
        //     });
        //     break;
        //   case ConfirmEventType.CANCEL:
        //     this.messageService.add({
        //       severity: 'warn',
        //       summary: 'Cancelled',
        //       detail: 'You have cancelled',
        //     });
        //     break;
        //   default:
        //     // Handle other cases, if necessary
        //     break;
        // }
      },
    });
  }
  // displayNewFileUpload(file: File) {
  //   const blobUrl = window.URL.createObjectURL(file as Blob);
  //   this.pdfUrl = blobUrl;
  //   this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  //   this.pdfLoaded = true;
  // }
}
