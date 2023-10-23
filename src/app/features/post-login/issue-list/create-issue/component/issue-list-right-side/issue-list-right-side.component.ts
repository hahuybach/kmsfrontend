import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-issue-list-right-side',
  templateUrl: './issue-list-right-side.component.html',
  styleUrls: ['./issue-list-right-side.component.scss']
})
export class IssueListRightSideComponent {
  @Output() toggleIssueListPopup = new EventEmitter<void>();

  changeInspectorVisible(){
    this.toggleIssueListPopup.emit();
  }
}
