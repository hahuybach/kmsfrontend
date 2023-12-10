import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {InspectionplanInspectorlistService} from "../../../../../services/inspectionplan-inspectorlist.service";

@Component({
  selector: 'app-issue-inspector-popup',
  templateUrl: './issue-inspector-popup.component.html',
  styleUrls: ['./issue-inspector-popup.component.scss']
})
export class IssueInspectorPopupComponent implements OnChanges {
  @Input() popupInspectorVisible: boolean;
  @Input() inspectorList: any[] = [];
  @Input() chiefList: any[] = [];
  @Input() inspectorListIsValid: boolean;
  @Output() popupInspectorVisibleChange = new EventEmitter<boolean>();
  @Output() selectedInspectorsList = new EventEmitter<any[]>();
  selectedInspectors: any[] = [];
  errorText: string = '';
  filterVisible: Boolean = false;

  constructor(
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService
  ) {
  }


  resetInspectorListVisible() {
    this.popupInspectorVisibleChange.emit(this.popupInspectorVisible);
  }

  addInspector() {
    if (!this.selectedInspectors || !this.selectedInspectors.length) {
      this.errorText = 'Vui lòng chọn ít nhất một thành viên cho đoàn kiểm tra';
      return;
    }
    this.errorText = '';
    this.inspectionplanInspectorService.saveToInspectorList(
      this.selectedInspectors
    );
    this.inspectionplanInspectorService.setInspectorListIsValid(true);
    this.selectedInspectorsList.emit(this.selectedInspectors);
    this.popupInspectorVisible = false;
    this.selectedInspectors = [];
  }

  isEligibleInspectorExist(selectedInspectors: any[]): boolean {
    let eligibleChiefList = selectedInspectors.filter(
      (eligibleInspector: { accountId: number }) =>
        this.chiefList.some(
          (inspector) => inspector.accountId === eligibleInspector.accountId
        )
    );
    console.log(eligibleChiefList);
    return eligibleChiefList.length > 0;
  }

  changeFilterVisible(status: Boolean) {
    this.filterVisible = status;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.inspectorList);
  }
}
