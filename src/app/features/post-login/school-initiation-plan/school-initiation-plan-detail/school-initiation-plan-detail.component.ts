import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  file: File;
  fileStatus = false;
  ngOnInit(): void {
    this.schoolinitiationplan = {
      name: 'Kế hoạch thực hiện nhiệm vụ năm học 2022 2023',
      school: 'Trường mầm non Ánh Sao',
      createdBy: 'Hà Ngọc Hùng',
      createdDate: '10/1/2022',
      status: {
        statusId: 1,
        statusName: 'Đang chờ',
      },
    };
  }

  selectedFilename: any;
  fileInputPlaceholders: string;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  inputFileForm = this.fb.group({
    file: [''],
  });
  approve() {
    console.log('123');
    this.schoolinitiationplan.status.statusId = 3;
    this.schoolinitiationplan.status.statusName = 'Phê duyệt';
    console.log(this.schoolinitiationplan.status.statusId);
  }
  reject() {
    console.log(1234);
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn không phê duyệt kế hoạch này?',
      header: 'Xác nhận không phê duyệt',
      icon: 'bi bi-exclamation-triangle-fill',
      accept: () => {
        this.schoolinitiationplan.status.statusId = 4;
        this.schoolinitiationplan.status.statusName = 'Không phê duyệt';
        this.messageService.add({
          severity: 'success',
          summary: 'Không phê duyệt',
          detail: 'Không phê duyệt thành công',
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
  handleFileInputChange(fileInput: any) {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.file = file;
      this.fileStatus = true;
      this.fileInputPlaceholders = file.name;
    }
  }
}
