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
import { FormBuilder, Validators } from '@angular/forms';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-white-space.validator';

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
  addedDocumentIssues = new Map<number, object>();
  issueId: any;
  issue: any;
  inspectorBeforeList: any; //list history
  inspectorLeftBeforeList: any; // list left history
  inspectorLeftList!: any[]; // list in popup
  isChanged = false;
  popupInspectorVisible = false;
  uploadFileVisible = false;
  selectedInspectors!: any[];
  popupInvalidDocVisible = false;
  invalidDoc!: any[];
  documentTypeId: any;
  documentId = 0;
  inEffectiveDocumentIds = new Map<number, number>();
  uploadFileName = 'sad';
  issueForm = this.fb.group({
    issueName: [
      '',
      // Validators.required,
      NoWhitespaceValidator(),
    ],
    description: ['', NoWhitespaceValidator()],
    inspectorId: [''],
    file: [Validators.required],
    // addedDocumentIssues: [],
    // inEffectiveDocumentIds: [],
  });
  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private inspectorService: InspectorService,
    private fb: FormBuilder
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
        this.issueForm.patchValue({
          issueName: this.issue.docName,
          description: this.issue.description,
          inspectorId: this.issue.inspector.map((item: any) => item.id),
        });
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
    this.issueForm.patchValue({
      inspectorId: this.issue.inspector.map((item: any) => item.id),
    });
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
    this.popupInspectorVisible = true;
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
    this.popupInspectorVisible = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'Thêm thành công',
    });
    // scroll to first
  }
  // update new doc
  onUpload(event: UploadEvent, documentTypeId: number, documentId: number) {
    this.addedDocumentIssues.set(documentTypeId, event.files[0]);
    this.uploadFileName = event.files[0].name;
    console.log(this.uploadFileName);
    this.inEffectiveDocumentIds.set(documentTypeId, documentId);
    console.log(this.addedDocumentIssues);
    this.uploadFileVisible = false;
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }
  togglePopupFileUpload(documentTypeId: number, documentId: number) {
    this.uploadFileVisible = true;
    console.log(documentTypeId, documentId);
    this.documentTypeId = documentTypeId;
    this.documentId = documentId;
  }
  togglePopupInvalidDoc() {
    this.invalidDoc = this.issue.file.filter(
      (item: { status: boolean }) => !item.status
    );
    console.log(this.invalidDoc);

    this.popupInvalidDocVisible = true;
  }
  onSubmit() {
    console.log(this.issue.inspector.length);
    const inspectorFormAttr = this.issueForm.get('inspectorId');
    if (inspectorFormAttr !== null) {
      inspectorFormAttr.patchValue(
        this.issue.inspector.map((item: any) => item.id)
      );
    }
    const fileFormAttr = this.issueForm.get('file');
    if (fileFormAttr !== null) {
      fileFormAttr.patchValue(this.issue.file);
    }
    // console.log(this.issueForm.value);
    const fileArray = Array.from(this.addedDocumentIssues, ([key, value]) => ({
      documentTypeId: key,
      file: value,
    }));
    console.log(fileArray);
    // XỬ LÝ FORM ARRAY
    // const addedDocumentIssuesAttr = this.issueForm.get('addedDocumentIssues');
    // if (addedDocumentIssuesAttr !== null) {
    //   addedDocumentIssuesAttr.patchValue(fileArray.map((item: any) => item))
    // }
    const docIdArray = Array.from(
      this.inEffectiveDocumentIds,
      ([key, value]) => ({
        documentTypeId: key,
        documentId: value,
      })
    );
    const documentIdsWithSameType = docIdArray
      .filter((doc) =>
        fileArray.some((file) => file.documentTypeId === doc.documentTypeId)
      )
      .map((doc) => doc.documentId);
    const data = {
      ...this.issueForm.value,
      addedDocumentIssuesAttr: fileArray,
      inEffectiveDocumentIds: documentIdsWithSameType,
    };
    const sentData = { issue: data };
    console.log(sentData);
  }
}
