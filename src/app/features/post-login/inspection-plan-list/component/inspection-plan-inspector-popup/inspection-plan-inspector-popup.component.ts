import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IssueService} from "../../../../../services/issue.service";

@Component({
  selector: 'app-inspection-plan-inspector-popup',
  templateUrl: './inspection-plan-inspector-popup.component.html',
  styleUrls: ['./inspection-plan-inspector-popup.component.scss']
})
export class InspectionPlanInspectorPopupComponent {
  @Input() popupInspectorVisible: boolean;
  @Output() popupInspectorVisibleChange = new EventEmitter<boolean>();
  @Output() inspectorSelectChange = new EventEmitter<any[]>();

  selectedInspectors:any = [];
  inspectorList: any = [];


  resetInspectorListVisible() {
    this.popupInspectorVisibleChange.emit(this.popupInspectorVisible);
  }

  addInspector() {
    this.inspectorSelectChange.emit(this.selectedInspectors);
    this.popupInspectorVisible = false;
  }

  constructor(
    private readonly issueService: IssueService,
  ) {
  }

  ngOnInit(): void {
    this.issueService.getCurrentActiveIssue().subscribe({
        next: (data) => {
          this.inspectorList = data.issueDto.inspectors;
          console.log(data.issueDto.inspectors)
        },
        error: (error): any => {
          console.log(error);
        }
      }
    )
  }
}
