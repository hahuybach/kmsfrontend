import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from '../../../../services/issue.service';
import { switchMap } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';
import { InspectorService } from 'src/app/services/inspector.service';
@Component({
  selector: 'app-update-issue',
  templateUrl: './update-issue.component.html',
  styleUrls: ['./update-issue.component.scss'],
})
export class UpdateIssueComponent implements OnInit {
  issueId: any;
  issue: any;
  inspector: any; //list ban dau tranh phai goi lai service
  inspectorList!: any[]; // list in popup
  isChanged = false;
  popupVisible = false;
  selectedInspectors!: any[];
  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private inspectorService: InspectorService
  ) {}
  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.issueId = +params['id'];
          return this.issueService.getIssueById(this.issueId);
        })
      )
      .subscribe((data) => {
        this.issue = data;
        this.inspector = this.issue.inspector;
        console.log(this.issue);
      });
    this.inspectorService.getInspectors().subscribe((data) => {
      console.log(data);
      this.inspectorList = data;
    });
  }
  toggleStatus() {
    this.isChanged = !this.isChanged;
  }
  toggleStore() {
    this.isChanged = !this.isChanged;
  }
  confirmDelete(id: number) {
    console.log('click icon');
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      // icon: 'pi pi-info-circle',
      accept: () => {
        this.issue.inspector = this.issue.inspector.filter(
          (item: any) => item.id != id
        );
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
          default:
            // Handle other cases, if necessary
            break;
        }
      },
    });
  }
  showInspectorPopup() {
    this.popupVisible = true;
  }
  toggleCancel() {
    this.isChanged = false;
    this.issue.inspector = this.inspector;
  }
  navigateToDetail(inspectorId: number) {
    console.log(inspectorId);
  }
  addInspector() {
    this.isChanged = false;
    this.inspectorList = this.inspectorList.filter(
      (val) => !this.selectedInspectors?.includes(val)
    );
    this.issue.inspector.push(...this.selectedInspectors);
    console.log(this.issue.inspector);
    this.popupVisible = false;
  }
}
