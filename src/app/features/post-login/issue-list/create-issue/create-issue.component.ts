import { Component } from '@angular/core';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss']
})
export class CreateIssueComponent {
  selectedFileName = "";
  docInputs: any = [
    {id: 1}
    ];
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      this.selectedFileName = files[0].name;
      console.log(this.selectedFileName)
      // Xử lý tệp đã chọn ở đây
    } else {
      this.selectedFileName = '';
    }
  }
  appendDocInput(){
    const newDocInput = {id:1};
    this.docInputs.push(newDocInput);
  }
}