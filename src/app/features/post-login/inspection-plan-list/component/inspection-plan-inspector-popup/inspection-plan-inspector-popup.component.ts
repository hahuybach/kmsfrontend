import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IssueService} from "../../../../../services/issue.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {InspectionplanInspectorlistService} from "../../../../../services/inspectionplan-inspectorlist.service";

@Component({
  selector: 'app-inspection-plan-inspector-popup',
  templateUrl: './inspection-plan-inspector-popup.component.html',
  styleUrls: ['./inspection-plan-inspector-popup.component.scss']
})
export class InspectionPlanInspectorPopupComponent{
  @Input() popupInspectorVisible: boolean;
  @Input() inspectorList: any[] = [];
  @Output() popupInspectorVisibleChange = new EventEmitter<boolean>();
  @Output() selectedInspectorsList = new EventEmitter<any[]>();
  selectedInspectors: any[] = [];

  constructor(
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService
  ) {
  }

  resetInspectorListVisible() {
    this.popupInspectorVisibleChange.emit(this.popupInspectorVisible);
  }

  addInspector() {
    this.inspectionplanInspectorService.saveToInspectorList(this.selectedInspectors);
    this.selectedInspectorsList.emit(this.selectedInspectors);
    this.popupInspectorVisible = false;
    this.selectedInspectors = [];
  }
}
