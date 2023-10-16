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

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-update-issue',
  templateUrl: './update-issue.component.html',
  styleUrls: ['./update-issue.component.scss'],
})
export class UpdateIssueComponent implements OnInit {
  uploadedFiles: any[] = [];
  issueId: any;
  issue: any;
  inspectorBeforeList: any; //list history
  inspectorLeftBeforeList: any; // list left history
  inspectorLeftList!: any[]; // list in popup
  isChanged = false;
  popupVisible = false;
  uploadFileVisible = false;
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
        this.inspectorBeforeList = this.issue.inspector;
      });
    this.inspectorService.getInspectors().subscribe((data) => {
      this.inspectorLeftList = data;
      this.inspectorLeftBeforeList = data;
    });
  }
  //toggle status in scrollview
  toggleStatus() {
    this.isChanged = !this.isChanged;
  }
  // store button in scrollview
  toggleStore() {
    this.isChanged = !this.isChanged;
    this.inspectorBeforeList = this.issue.inspector;
    this.inspectorLeftBeforeList = this.inspectorLeftList;
  }
  // click trash icon event in scrollview
  confirmDelete(inspector: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      // icon: 'pi pi-info-circle',
      accept: () => {
        this.inspectorBeforeList = this.issue.inspector;
        this.issue.inspector = this.issue.inspector.filter(
          (item: any) => item.id != inspector.id
        );
        // add lại vào danh sách trong popup
        this.inspectorLeftBeforeList = this.inspectorLeftList;
        this.inspectorLeftList = [...this.inspectorLeftList, inspector];
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
  //toggle inspector group popup
  showInspectorPopup() {
    this.popupVisible = true;
  }
  //toggle cancel button scrollview
  toggleCancel() {
    this.isChanged = false;
    this.issue.inspector = this.inspectorBeforeList;
    this.inspectorLeftList = this.inspectorLeftBeforeList;
  }

  // navigateToDetail(inspectorId: number) {
  //   console.log(inspectorId);
  // }

  //click plus icon event scrollview
  addInspector() {
    this.isChanged = false;
    this.inspectorLeftBeforeList = this.inspectorLeftList;
    this.inspectorLeftList = this.inspectorLeftList.filter(
      (val) => !this.selectedInspectors?.includes(val)
    );
    this.inspectorBeforeList = this.issue.inspector;
    this.issue.inspector.push(...this.selectedInspectors);
    this.selectedInspectors = [];
    this.popupVisible = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'Thêm thành công',
    });
    // scroll to first
  }
  // update new doc
  onUpload(event: UploadEvent) {
    console.log('upload');
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    // console.log(this.uploadedFiles);
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }
  togglePopupFileUpload() {
    this.uploadFileVisible = true;
  }
}
