import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InspectionplanInspectorlistService} from "../../../../../services/inspectionplan-inspectorlist.service";
import {ConfirmationService, ConfirmEventType} from "primeng/api";
import {getFirstAndLastName} from "../../../../../shared/util/util";

@Component({
  selector: 'app-issue-inspector-list',
  templateUrl: './issue-inspector-list.component.html',
  styleUrls: ['./issue-inspector-list.component.scss']
})
export class IssueInspectorListComponent {
  @Input() listEditable: boolean = false;
  @Input() selectedInspectors: any[] = [];
  @Input() chiefList: any[] = [];
  @Output() toggleIssueListPopup = new EventEmitter<void>();
  @Output() resetList = new EventEmitter<boolean>();
  @Output() recreateInspectorList = new EventEmitter<boolean>();
  @Output() inspectorList = new EventEmitter<any[]>();
  toggleChange: boolean = true;
  deleteButtonVisibility: boolean = false;
  inspector: object = {
    accountId: 0,

  }

  constructor(
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService,
    private readonly confirmationService: ConfirmationService,
  ) {
  }

  confirmDeleteRemainingInspector(index: number) {
    this.confirmationService.confirm({
      message: 'Xóa thanh tra này sẽ xóa danh sách do không đủ ứng viên trưởng đoàn. Bạn có muốn tiếp tục?',
      header: 'Xác nhận xóa thanh tra',
      key: 'confirmDeleteRemainingInspector',
      icon: 'bi bi-exclamation-triangle',
      accept: () => {
        this.recreateInspectorList.emit();
        return;
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  confirmDeleteInspector(index: number) {
    this.confirmationService.confirm({
      message: 'Xác nhận xóa thanh tra này ?',
      header: 'Xác nhận xóa thanh tra',
      key: 'confirmDeleteInspector',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteInspector(index);
        return;
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  changeInspectorVisible() {
    this.toggleIssueListPopup.emit();
  }

  changeToggleStatus() {
    this.toggleChange = !this.toggleChange;
    this.deleteButtonVisibility = !this.deleteButtonVisibility;
  }

  isEligibleInspectorExist(selectedInspectors: any[]): boolean {
    let eligibleChiefList = selectedInspectors.filter((eligibleInspector: {
      accountId: number;
    }) => this.chiefList.some(inspector => inspector.accountId === eligibleInspector.accountId));
    return eligibleChiefList.length > 0;
  }

  onDeleteInspector(index: number) {
    let tempSelectedInspectors = this.selectedInspectors.slice();
    tempSelectedInspectors.splice(index, 1);
  }

  deleteInspector(index: number) {
    this.inspectionplanInspectorService.deleteFromInspectorList(this.selectedInspectors[index]);
  }

  getAvatar(fullName: string){
    return getFirstAndLastName(fullName);
  }

  onReset() {
    this.resetList.emit();
    this.changeToggleStatus();
  }

  onSave() {
    let inspectorList = this.inspectionplanInspectorService.saveChanges();
    this.inspectorList.emit(inspectorList);
    this.changeToggleStatus();
  }

}
