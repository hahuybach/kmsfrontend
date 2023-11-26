import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskDetailDto} from "../../../../../models/task";
import {RecordService} from "../../../../../services/record.service";

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.scss']
})
export class RecordDetailComponent implements OnChanges, OnInit{
  @Input() canUploadDocument: boolean = false;
  @Input() recordId: number;
  @Input() detailRecordPopupVisible: boolean = true;
  @Output() detailRecordPopupVisibleChange = new EventEmitter<boolean>();
  task: TaskDetailDto;
  fileInputPlaceholders: string;
  documentForm: FormGroup;


  constructor(
    private readonly recordService: RecordService,
    private fb: FormBuilder,
  ) {
  }

  resetDetailRecordPopupVisible(){
    this.detailRecordPopupVisibleChange.emit(this.detailRecordPopupVisible);
  }

  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.documentForm.get('documentFile')?.setValue(file);
      this.fileInputPlaceholders = file.name;
    } else {
      this.documentForm.get('documentFile')?.setValue(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['recordId'] || changes['recordId'].currentValue === undefined) {
      return;
    }
    this.recordService.getRecordById(this.recordId).subscribe({
      next: (data) => {
        this.task = data.taskDetailDto;
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  onSubmit(){
    if (this.documentForm.invalid){
      this.documentForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const document = {
      taskId: this.recordId,
      documentName: this.documentForm.get('documentName')?.value,
      documentCode: this.documentForm.get('documentCode')?.value
    }

    formData.append("request", new Blob([JSON.stringify(document)], {type: "application/json"}))
    const file = this.documentForm.get('documentFile')?.value
    formData.append(`file`, file, file.name);

    const documentUpdate = this.recordService.updateTaskDocument(formData).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      documentName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      documentCode: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      documentFile: [null, Validators.compose([Validators.required])]
    })
  }

}
