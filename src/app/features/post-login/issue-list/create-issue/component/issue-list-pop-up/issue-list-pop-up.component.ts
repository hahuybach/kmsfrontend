import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-issue-list-pop-up',
  templateUrl: './issue-list-pop-up.component.html',
  styleUrls: ['./issue-list-pop-up.component.scss']
})
export class IssueListPopUpComponent {
  @Input() popupInspectorVisible:boolean;
  @Output() popupInspectorVisibleChange = new EventEmitter<boolean>();
  inspectorLeftList:any= [];
  selectedInspectors: any = [];
  resetInspectorListVisible(){
    this.popupInspectorVisibleChange.emit(this.popupInspectorVisible);
  }
  addInspector(){}
}
