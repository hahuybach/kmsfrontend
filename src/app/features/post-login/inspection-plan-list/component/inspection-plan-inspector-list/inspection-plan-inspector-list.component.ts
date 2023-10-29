import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-inspection-plan-inspector-list',
  templateUrl: './inspection-plan-inspector-list.component.html',
  styleUrls: ['./inspection-plan-inspector-list.component.scss']
})
export class InspectionPlanInspectorListComponent {
  @Input()  selectedInspectors:any[] = [];
  @Output() toggleIssueListPopup = new EventEmitter<void>();

  changeInspectorVisible() {
    this.toggleIssueListPopup.emit();
  }
}
