import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-inspection-plan-inspector-list',
  templateUrl: './inspection-plan-inspector-list.component.html',
  styleUrls: ['./inspection-plan-inspector-list.component.scss']
})
export class InspectionPlanInspectorListComponent implements OnInit{
  @Input() listEditable: boolean = false;
  @Input()  selectedInspectors:any[] | null = [];
  @Output() toggleIssueListPopup = new EventEmitter<void>();

  ngOnInit() {
    console.log(this.selectedInspectors?.length)
  }

  changeInspectorVisible() {
    this.toggleIssueListPopup.emit();
  }
}
