import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {InspectionplanInspectorlistService} from "../../../../../services/inspectionplan-inspectorlist.service";
import {ConfirmEventType, ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-inspection-plan-inspector-list',
  templateUrl: './inspection-plan-inspector-list.component.html',
  styleUrls: ['./inspection-plan-inspector-list.component.scss']
})
export class InspectionPlanInspectorListComponent {
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
    private readonly confirmationService : ConfirmationService,
  ) {
  }
  confirmDeleteRemainingInspector(index: number) {
    this.confirmationService.confirm({
      message: 'Xóa thanh tra này sẽ khiến danh sách danh tra bị xóa do không đủ ứng viên cho trưởng đoàn. Bạn có muốn tiếp tục?',
      header: 'Xác nhận xóa thanh tra',
      key: 'confirmDeleteRemainingInspector',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.recreateInspectorList.emit();
        return;
      },
      reject: (type : ConfirmEventType) => {
        switch (type){
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
      reject: (type : ConfirmEventType) => {
        switch (type){
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  changeInspectorVisible() {
    console.log(this.selectedInspectors)
    console.log(this.chiefList)
    this.toggleIssueListPopup.emit();
  }
  changeToggleStatus() {
    this.toggleChange = !this.toggleChange;
    this.deleteButtonVisibility = !this.deleteButtonVisibility;
    console.log(this.selectedInspectors)
  }

  isEligibleInspectorExist(selectedInspectors: any[]): boolean {
    let eligibleChiefList = selectedInspectors.filter((eligibleInspector: { accountId: number; }) => this.chiefList.some(inspector => inspector.accountId === eligibleInspector.accountId));
    return eligibleChiefList.length > 0;
  }

  onDeleteInspector(index: number){
    let tempSelectedInspectors = this.selectedInspectors.slice();
    tempSelectedInspectors.splice(index, 1);
    if (!this.isEligibleInspectorExist(tempSelectedInspectors)){
      this.confirmDeleteRemainingInspector(index);
    }else {
      this.confirmDeleteInspector(index);
    }
  }

  deleteInspector(index: number){
    this.inspectionplanInspectorService.deleteFromInspectorList(this.selectedInspectors[index]);
  }

  onReset(){
    this.resetList.emit();
    this.changeToggleStatus();
  }

  onSave(){
    let inspectorList = this.inspectionplanInspectorService.saveChanges();
    this.inspectorList.emit(inspectorList);
    this.changeToggleStatus();
  }

}