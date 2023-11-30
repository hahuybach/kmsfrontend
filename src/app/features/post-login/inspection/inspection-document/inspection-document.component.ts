import { Component, OnInit } from '@angular/core';
import { InspectionDocument } from '../../../../models/inspection';
import { InspectionService } from '../../../../services/inspection.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { RecordService } from '../../../../services/record.service';
import { ToastService } from '../../../../shared/toast/toast.service';

@Component({
  selector: 'app-inspection-document',
  templateUrl: './inspection-document.component.html',
  styleUrls: ['./inspection-document.component.scss'],
})
export class InspectionDocumentComponent implements OnInit {
  inspectionId: number;
  recordId: number;
  inspectionDocument: InspectionDocument;
  createRecordPopupVisible: boolean = false;
  updateRecordPopupVisible: boolean = false;
  detailRecordPopupVisible: boolean = false;
  canUploadDocument: boolean = false;
  filterVisible: Boolean = false;
  constructor(
    private readonly inspectionService: InspectionService,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly recordService: RecordService,
    private readonly toastService: ToastService
  ) {}

  changeCreateRecordVisible() {
    this.createRecordPopupVisible = !this.createRecordPopupVisible;
  }

  changeUpdateRecordVisible() {
    this.updateRecordPopupVisible = !this.updateRecordPopupVisible;
  }

  initUpdateRecordData(recordId: number) {
    this.recordId = recordId;
    this.changeUpdateRecordVisible();
  }

  changeDetailRecordVisible() {
    this.detailRecordPopupVisible = !this.detailRecordPopupVisible;
  }

  initDetailRecordData(recordId: number) {
    this.recordId = recordId;
    if (
      this.inspectionDocument.isChief &&
      (recordId === this.inspectionDocument.reportId ||
        recordId === this.inspectionDocument.conclusionId)
    ) {
      this.canUploadDocument = true;
    } else {
      this.canUploadDocument = false;
    }
    this.changeDetailRecordVisible();
  }

  handleOnClickDeleteRecord(recordId: number) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa mục kiểm tra này?',
      header: 'Xác nhận xóa mục kiểm tra',
      key: 'deleteRecord',
      icon: 'bi bi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(recordId);
      },
      reject: (type: ConfirmEventType) => {},
    });
  }

  deleteRecord(recordId: number) {
    const deleteRecord = this.recordService
      .deleteRecordById(recordId)
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess(
            'deleteComplete',
            'Xóa thành công',
            'Mục kiểm tra đã được xóa thành công'
          );
          this.initInspectionData();
        },
        error: (error) => {
          this.toastService.showError(
            'deleteInComplete',
            'Xóa không thành công',
            error.error.message
          );
        },
      });
  }

  initInspectionData() {
    this.inspectionService.getInspectionDocument(this.inspectionId).subscribe({
      next: (data) => {
        this.inspectionDocument = data;
        console.log(this.inspectionDocument);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    this.route.parent?.params.subscribe((parentParams) => {
      this.inspectionId = parentParams['id'];
    });
    this.initInspectionData();
  }
  changeFilterVisible(status: Boolean) {
    this.filterVisible = status;
  }
}
