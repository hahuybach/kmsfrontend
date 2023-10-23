import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface DocumentIssue {
  documentName: string;
  documentCode: string;
  file: any; // Update the type of 'file' as per your requirements
}
@Component({
  selector: 'app-update-issue',
  templateUrl: './update-issue.component.html',
  styleUrls: ['./update-issue.component.scss'],
})
export class UpdateIssueComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef;
  addedDocumentIssues = new Map<number, object>();
  file: File;
  fileInputPlaceholders: string;
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
  inEffectiveDocumentIds: number[] = [];
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
    documentName: [''],
    documentCode: [''],
    inspector: [''],
    // addedDocumentIssues: [],
    // inEffectiveDocumentIds: [],
  });
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private inspectorService: InspectorService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    protected http: HttpClient,
    private fileService: FileService,
    private sanitizer: DomSanitizer
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
        this.issue = data.issue;
        console.log(this.issue);
        this.inspectorBeforeList = this.issue.inspectors;
        this.issueForm.patchValue({
          issueName: this.issue.issueName,
          description: this.issue.description,
          inspectorId: this.issue.inspectors.map((item: any) => item.accountId),
        });
        console.log(this.issueForm.value);
      });
    this.inspectorService.getNoneInspectors().subscribe((data) => {
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
      inspectorId: this.issue.inspectors.map((item: any) => item.accountId),
    });
  }
  // click trash icon event in scrollview
  confirmDelete(inspector: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      // icon: 'pi pi-info-circle',
      accept: () => {
        this.inspectorBeforeList = this.issue.inspectors;
        this.issue.inspectors = this.issue.inspectors.filter(
          (item: any) => item.accountId != inspector.accountId
        );
        // add lại vào danh sách trong popup
        this.inspectorLeftBeforeList = this.inspectorLeftList;
        this.inspectorLeftList.push(inspector);
        this.inspectorLeftList = [...this.inspectorLeftList];
        console.log(this.inspectorLeftList);
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
    this.issue.inspectors = this.inspectorBeforeList;
    this.inspectorLeftList = this.inspectorLeftBeforeList;
  }

  //click plus icon event scrollview
  addInspector() {
    this.isChanged = false;
    this.inspectorLeftBeforeList = this.inspectorLeftList;
    this.inspectorLeftList = this.inspectorLeftList.filter(
      (val) => !this.selectedInspectors?.includes(val)
    );
    this.inspectorBeforeList = this.issue.inspectors;
    this.issue.inspectors.push(...this.selectedInspectors);
    this.selectedInspectors = [];
    this.popupInspectorVisible = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'Thêm thành công',
    });
    // scroll to first
  }
  resetFileInput() {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = null;
    }
  }
  handleFileInputChange(fileInput: any): void {
    const files = fileInput.files;
    if (files.length > 0) {
      const file = files[0];
      this.file = file;
      this.fileInputPlaceholders = file.name;
    }
  }
  upload() {
    const dataObject = {
      documentName: this.issueForm.get('documentName')?.value,
      documentCode: this.issueForm.get('documentCode')?.value,
      file: this.file,
    };
    this.addedDocumentIssues.set(this.documentTypeId, dataObject);
    this.inEffectiveDocumentIds.push(this.documentId);
    console.log(this.addedDocumentIssues);
    // reset dialog
    this.issueForm.get('documentName')?.setValue('');
    this.issueForm.get('documentCode')?.setValue('');
    this.fileInputPlaceholders = '';
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = null;
    }
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
    this.uploadFileVisible = false;
  }
  onHideEvent() {
    this.issueForm.get('documentName')?.setValue('');
    this.issueForm.get('documentCode')?.setValue('');
    this.fileInputPlaceholders = '';
  }

  togglePopupFileUpload(
    event: MouseEvent,
    documentTypeId: number,
    documentId: number
  ) {
    event.stopPropagation();
    this.uploadFileVisible = true;
    console.log(documentTypeId, documentId);
    this.documentTypeId = documentTypeId;
    this.documentId = documentId;
  }
  togglePopupInvalidDoc() {
    this.invalidDoc = this.issue.documentDtos.filter(
      (document: any) => document.status.statusId === 2
    );

    this.popupInvalidDocVisible = true;
  }
  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.fileService.downloadPdf(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }
  onSubmit() {
    // console.log(this.issue.inspector.length);
    const inspectorFormAttr = this.issueForm.get('inspectorId');
    if (inspectorFormAttr !== null) {
      inspectorFormAttr.patchValue(
        this.issue.inspectors.map((item: any) => item.accountId)
      );
    }
    console.log(this.addedDocumentIssues);

    const addedDocumentIssues: DocumentIssue[] = Array.from(
      this.addedDocumentIssues.entries()
    ).map(([key, value]: [number, Record<string, any>]) => {
      return {
        documentName: value['documentName'],
        documentCode: value['documentCode'],
        documentTypeId: key,
        file: value['file'],
      };
    });

    const files = addedDocumentIssues.map((item) => item.file);
    console.log(files);
    const addedDocumentIssuesFinal = addedDocumentIssues.map(
      ({ file, ...rest }) => rest
    );
    const formData = new FormData();
    const issue = {
      issueId: this.issue.issueId,
      issueName: this.issueForm.get('issueName')?.value,
      description: this.issueForm.get('description')?.value,
      inspectorId: this.issueForm.get('inspectorId')?.value,
      addedDocumentIssues: addedDocumentIssuesFinal,
      inEffectiveDocumentIds: this.inEffectiveDocumentIds,
      status: this.issue.status,
    };
    console.log(issue);
    formData.append(
      'issue',
      new Blob([JSON.stringify(issue)], { type: 'application/json' })
    );
    files.forEach((item) => {
      const file: File = item; // Assuming the file property is of type File
      console.log(file);
      // Append each file to the FormData object
      formData.append('files', file, file['name']);
    });
    console.log(formData.getAll('issue'));
    console.log(formData.getAll('files'));

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'undefined');
    this.http
      .put('http://localhost:8080/api/v1/issue/', formData, { headers })
      .subscribe(
        (response) => {
          console.log('Form data sent to the backend:', response);
        },
        (error) => {
          console.error('Error while sending form data:', error);
        }
      );
  }
}
