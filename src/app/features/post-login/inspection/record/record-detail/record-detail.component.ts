import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskDetailDto} from "../../../../../models/task";
import {RecordService} from "../../../../../services/record.service";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {ToastService} from "../../../../../shared/toast/toast.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.scss']
})
export class RecordDetailComponent implements OnChanges, OnInit {
  @Input() canUploadDocument: boolean = false;
  @Input() canDeleteDocument: boolean = false;
  @Input() recordId: number;
  @Input() detailRecordPopupVisible: boolean = true;
  @Output() detailRecordPopupVisibleChange = new EventEmitter<boolean>();
  task: TaskDetailDto;
  fileInputPlaceholders: string;
  documentForm: FormGroup;
  updateDocumentSubmitted: boolean = false;
  updateDocumentCompleted: boolean = false;
  private subscriptions: Subscription[] = [];


  constructor(
    private readonly recordService: RecordService,
    private fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: ToastService
  ) {
  }

  resetDetailRecordPopupVisible() {
    this.resetForm();
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

  handleOnClickDeleteDocument() {
    this.confirmationService.confirm({
      message: "Bạn có chắc muốn xóa mục kiểm tra này?",
      header: "Xác nhận xóa mục kiểm tra",
      key: "deleteDocument",
      icon: 'bi bi-exclamation-triangle',
      accept: () => {
        this.deleteDocument();
      },
      reject: (type: ConfirmEventType) => {
      }
    })
  }

  deleteDocument() {
    console.log('delete')
    const deleteDocument = this.recordService.deleteDocumentById(this.recordId).subscribe({
      next: (response) => {
        this.toastService.showSuccess('deleteComplete', "Xóa thành công", "Tài liệu đã được xóa thành công");
        setTimeout(() => {
          this.detailRecordPopupVisible = false;
          this.initRecordData();
        }, 1000);
      },
      error: (error) => {
        this.toastService.showError('deleteInComplete', "Xóa không thành công", error.error.message);
      }
    })
    this.subscriptions.push(deleteDocument);
  }

  resetForm() {
    this.documentForm.reset();
    this.updateDocumentCompleted = false;
    this.updateDocumentSubmitted = false;
    this.fileInputPlaceholders = '';
  }

  initRecordData(){
    const initRecordData = this.recordService.getRecordById(this.recordId).subscribe({
      next: (data) => {
        this.task = data.taskDetailDto;
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.subscriptions.push(initRecordData)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['recordId'] || changes['recordId'].currentValue === undefined) {
      return;
    }
    this.initRecordData();
  }

  onSubmit() {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const document = {
      taskId: this.recordId,
      documentTaskDto: {
        documentName: this.documentForm.get('documentName')?.value,
        documentCode: this.documentForm.get('documentCode')?.value
      }
    }

    formData.append("request", new Blob([JSON.stringify(document)], {type: "application/json"}))
    const file = this.documentForm.get('documentFile')?.value
    formData.append(`file`, file, file.name);

    this.updateDocumentSubmitted = true;
    const documentUpdate = this.recordService.updateTaskDocument(formData).subscribe({
      next: (response) => {
        this.updateDocumentCompleted = true;
        setTimeout(() => {
          this.detailRecordPopupVisible = false;
          this.resetForm();
          this.initRecordData();
        }, 1000);
      },
      error: (error) => {
        this.toastService.showError('deleteInComplete', "Cập nhật tài liệu không thành công", error.error.message);
      }
    })
    this.subscriptions.push(documentUpdate);
  }

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      documentName: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      documentCode: [null, Validators.compose([Validators.required, Validators.maxLength(256)])],
      documentFile: [null, Validators.compose([Validators.required])]
    })
  }

  private unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

}
