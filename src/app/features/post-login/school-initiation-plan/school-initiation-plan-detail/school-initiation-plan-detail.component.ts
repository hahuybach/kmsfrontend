import { Component } from '@angular/core';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-school-initiation-plan-detail',
  templateUrl: './school-initiation-plan-detail.component.html',
  styleUrls: ['./school-initiation-plan-detail.component.scss'],
})
export class SchoolInitiationPlanDetailComponent {
  uploadedFiles: any[] = [];
  schoolinitiationplan = {
    name: 'Kế hoạch thực hiện nhiệm vụ năm học 2022 2023',
    school: 'Trường mầm non Ánh Sao',
    createdBy: 'Hà Ngọc Hùng',
    createdDate: '10/1/2022',
  };
  selectedFilename: any;
  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    console.log(this.uploadedFiles);
  }
}
