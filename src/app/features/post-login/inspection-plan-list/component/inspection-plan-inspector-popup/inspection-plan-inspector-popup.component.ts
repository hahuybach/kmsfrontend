import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IssueService } from '../../../../../services/issue.service';
import { error } from '@angular/compiler-cli/src/transformers/util';
import { InspectionplanInspectorlistService } from '../../../../../services/inspectionplan-inspectorlist.service';

@Component({
  selector: 'app-inspection-plan-inspector-popup',
  templateUrl: './inspection-plan-inspector-popup.component.html',
  styleUrls: ['./inspection-plan-inspector-popup.component.scss'],
})
export class InspectionPlanInspectorPopupComponent {
  @Input() popupInspectorVisible: boolean;
  @Input() inspectorList: any[] = [];
  @Input() chiefList: any[] = [];
  @Output() popupInspectorVisibleChange = new EventEmitter<boolean>();
  @Output() selectedInspectorsList = new EventEmitter<any[]>();
  selectedInspectors: any[] = [];
  errorText: string = '';
  filterVisible: Boolean = false;
  constructor(
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService
  ) {}

  resetInspectorListVisible() {
    this.popupInspectorVisibleChange.emit(this.popupInspectorVisible);
  }

  addInspector() {
    if (!this.selectedInspectors || !this.selectedInspectors.length) {
      this.errorText = 'Vui lòng chọn ít nhất một thành viên cho đoàn kiểm tra';
      return;
    } else if (!this.isEligibleInspectorExist(this.selectedInspectors)) {
      this.errorText =
        'Đoàn kiểm tra phải bao gồm ít nhất một trưởng phòng hoặc phó phòng';
      return;
    }
    this.errorText = '';
    this.inspectionplanInspectorService.saveToInspectorList(
      this.selectedInspectors
    );
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
}
