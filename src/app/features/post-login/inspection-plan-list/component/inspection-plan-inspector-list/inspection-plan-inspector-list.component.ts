import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {InspectionplanInspectorlistService} from "../../../../../services/inspectionplan-inspectorlist.service";

@Component({
  selector: 'app-inspection-plan-inspector-list',
  templateUrl: './inspection-plan-inspector-list.component.html',
  styleUrls: ['./inspection-plan-inspector-list.component.scss']
})
export class InspectionPlanInspectorListComponent {
  @Input() listEditable: boolean = false;
  @Input() selectedInspectors: any[] = [];
  @Output() toggleIssueListPopup = new EventEmitter<void>();
  @Output() resetList = new EventEmitter<boolean>();
  @Output() inspectorList = new EventEmitter<any[]>();
  toggleChange: boolean = true;
  deleteButtonVisibility: boolean = false;
  inspector: object = {
    accountId: 0,

  }

  constructor(
    private readonly inspectionplanInspectorService: InspectionplanInspectorlistService
  ) {
  }

  changeInspectorVisible() {
    this.toggleIssueListPopup.emit();
  }

  changeToggleStatus() {
    this.toggleChange = !this.toggleChange;
    this.deleteButtonVisibility = !this.deleteButtonVisibility;
    console.log(this.selectedInspectors)
  }

  onDeleteInspector(index: number){
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
