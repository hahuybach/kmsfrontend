import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
        statusId: 3,
        statusName: 'Đang chờ',
      },
    };
  }

  selectedFilename: any;
  fileInputPlaceholders: string;
  constructor(private fb: FormBuilder) {}
  inputFileForm = this.fb.group({
    file: [''],
  });
  approve() {
    console.log('123');
    this.schoolinitiationplan.status.statusId = 1;
    this.schoolinitiationplan.status.statusName = 'Phê duyệt';
    console.log(this.schoolinitiationplan.status.statusId);
  }
  reject() {
    console.log(1234);
    this.schoolinitiationplan.status.statusId = 2;
    this.schoolinitiationplan.status.statusName = 'Không phê duyệt';
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
