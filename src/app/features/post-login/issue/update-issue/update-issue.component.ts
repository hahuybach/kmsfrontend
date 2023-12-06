import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
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
import { ToastService } from 'src/app/shared/toast/toast.service';
import { Dialog } from 'primeng/dialog';

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
export class UpdateIssueComponent implements OnInit, AfterViewInit {
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
  documentTypeName = '';
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
    file: [null, Validators.required],
    documentName: [
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(256),
        NoWhitespaceValidator(),
      ]),
    ],
    documentCode: [
      '',
      Validators.compose([Validators.required, Validators.maxLength(256)]),
    ],
    inspector: [''],
  });
  filterVisible: Boolean = false;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  sub: any[] = [];
  isLoading: boolean = false;
  submitCompleted: boolean = false;
  pdfPreviewVisibility: boolean = false;
  @ViewChild('pdfDialog') yourDialog!: Dialog;
  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private inspectorService: InspectorService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    protected http: HttpClient,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    const sub = this.route.params
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
    this.sub.push(sub);
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
    if (this.issue.inspectors.length == 1) {
      this.toastService.showWarn(
        'toastUpdateIssue',
        'Cảnh báo',
        'Danh sách cần ít nhất 1 người'
      );
    } else {
      this.confirmationService.confirm({
        message:
          'Bạn có muốn xóa ' + inspector.user.fullName + ' khỏi danh sách?',
        header: 'Xác nhận xóa',
        key: 'confirmUpdateIssue',
        accept: () => {
          this.inspectorBeforeList = this.issue.inspectors.slice();
          this.issue.inspectors = this.issue.inspectors.filter(
            (item: any) => item.accountId != inspector.accountId
          );
          // add lại vào danh sách trong popup
          this.inspectorLeftBeforeList = this.inspectorLeftList.slice();
          this.inspectorLeftList.push(inspector);
          this.toastService.showSuccess(
            'toastUpdateIssue',
            'Xóa thành công',
            'Đã xóa ' + inspector.user.fullName + ' khỏi danh sách'
          );
        },
      });
    }
  }
  //toggle inspector group popup
  showInspectorPopup() {
    this.popupInspectorVisible = true;
  }
  //toggle cancel button scrollview
  toggleCancel() {
    this.isChanged = false;
    this.issue.inspectors = this.inspectorBeforeList.slice();
    this.inspectorLeftList = this.inspectorLeftBeforeList.slice();
  }

  //click plus icon event scrollview
  addInspector() {
    this.isChanged = false;
    this.inspectorLeftBeforeList = this.inspectorLeftList.slice();
    this.inspectorLeftList = this.inspectorLeftList.filter(
      (val) => !this.selectedInspectors?.includes(val)
    );
    this.inspectorBeforeList = this.issue.inspectors.slice();
    this.issue.inspectors.push(...this.selectedInspectors);
    this.selectedInspectors = [];
    this.popupInspectorVisible = false;
    this.toastService.showSuccess(
      'toastUpdateIssue',
      'Thêm thành công',
      'Thêm thành công người vào danh sách'
    );
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
      this.issueForm.get('file')?.setValue(file);
      this.fileInputPlaceholders = file.name;
    }
  }
  getSize(size: number): string {
    const n: number = 1024;
    let s: string = '';
    const kb: number = size / n;
    const mb: number = kb / n;
    const gb: number = mb / n;
    const tb: number = gb / n;

    if (size < n) {
      s = size + ' Bytes';
    } else if (size >= n && size < n * n) {
      s = kb.toFixed(1) + ' KB';
    } else if (size >= n * n && size < n * n * n) {
      s = mb.toFixed(1) + ' MB';
    } else if (size >= n * n * n && size < n * n * n * n) {
      s = gb.toFixed(2) + ' GB';
    } else if (size >= n * n * n * n) {
      s = tb.toFixed(2) + ' TB';
    }

    return s;
  }
  upload() {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }
    const dataObject = {
      documentName: this.issueForm.get('documentName')?.value,
      documentCode: this.issueForm.get('documentCode')?.value,
      file: this.file,
    };
    this.addedDocumentIssues.set(this.documentTypeId, dataObject);

    // inactive old document
    console.log(this.documentId);
    if (this.documentId != null) {
      const filteredDocuments = this.issue.documentDtos.find(
        (doc: any) => doc.documentId === this.documentId
      );
      filteredDocuments.status.statusId = 2;
      filteredDocuments.status.statusName = 'Mất hiệu lực';
      this.inEffectiveDocumentIds.push(this.documentId);
    } else {
      this.issue.documentDtos = this.issue.documentDtos.filter(
        (item: any) =>
          item.documentType.documentTypeId !== this.documentTypeId ||
          item.documentId !== undefined
      );
      console.log(this.issue.documentDtos);
    }

    this.issue.documentDtos.push({
      documentName: this.issueForm.get('documentName')?.value,
      documentType: {
        documentTypeName: this.documentTypeName,
        documentTypeId: this.documentTypeId,
      },
      documentCode: this.issueForm.get('documentCode')?.value,
      uploadedDate: new Date(),
      sizeFormat: this.getSize(this.file.size),
      status: {
        statusId: 1,
        statusName: 'Hiệu lực',
      },
      fileExtension: 'pdf',
      file: this.file,
    });
    console.log(this.addedDocumentIssues);
    // reset dialog
    this.issueForm.get('documentName')?.setValue('');
    this.issueForm.get('documentCode')?.setValue('');
    this.fileInputPlaceholders = '';
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = null;
    }
    this.toastService.showInfo(
      'toastUpdateIssue',
      'Tài liệu đã được tải lên',
      ''
    );
    this.uploadFileVisible = false;
  }
  onHideEvent() {
    this.issueForm.get('documentName')?.setValue('');
    this.issueForm.get('documentCode')?.setValue('');
    this.fileInputPlaceholders = '';
    this.issueForm.reset();
    this.issueForm.patchValue({
      issueName: this.issue.issueName,
      description: this.issue.description,
      inspectorId: this.issue.inspectors.map((item: any) => item.accountId),
    });
  }

  togglePopupFileUpload(
    event: MouseEvent,
    documentTypeId: number,
    documentId: number,
    documentName: string,
    documentTypeName: string
  ) {
    console.log(documentId);

    event.stopPropagation();
    this.documentTypeName = documentTypeName;
    this.documentTypeId = documentTypeId;
    this.documentId = documentId;
    this.confirmationService.confirm({
      message:
        'Bạn có muốn cập nhật tài liệu mới và vô hiệu hóa tài liệu ' +
        documentName +
        ' ?',
      header: 'Xác nhận cập nhật',
      key: 'confirmUpdateIssue',
      // icon: 'pi pi-info-circle',
      accept: () => {
        this.uploadFileVisible = true;
      },
    });
  }
  togglePopupInvalidDoc() {
    this.invalidDoc = this.issue.documentDtos.filter(
      (document: any) => document.status.statusId === 2
    );

    this.popupInvalidDocVisible = true;
  }
  openNewTab(documentLink: string) {
    this.pdfPreviewVisibility = true;
    console.log(documentLink);
    const sub = this.fileService
      .readIssuePDF(documentLink)
      .subscribe((response) => {
        const blobUrl = window.URL.createObjectURL(response.body as Blob);
        this.pdfUrl = blobUrl;
        this.safePdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.pdfLoaded = true;
      });
    this.sub.push(sub);
  }
  displayNewFileUpload(file: File) {
    const blobUrl = window.URL.createObjectURL(file as Blob);
    this.pdfUrl = blobUrl;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.pdfLoaded = true;
  }
  onSubmit() {
    this.isLoading = true;
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
    addedDocumentIssues.sort(
      (a: any, b: any) => a.documentTypeId - b.documentTypeId
    );
    console.log(addedDocumentIssues);
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
    this.issueService.updateIssue(formData).subscribe({
      next: (response) => {
        this.submitCompleted = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 1500);
        // this.uploadFileVisible = false;
        // this.toastService.showSuccess(
        //   'toastUpdateIssue',
        //   'Cập nhật thành công',
        //   'Cập nhật kế hoạch kiểm tra thành công'
        // );
      },
      error: (error) => {
        this.toastService.showError(
          'toastUpdateIssue',
          'Cập nhật thất bại',
          error.error.message
        );
      },
    });
  }
  changeFilterVisible(status: Boolean) {
    this.filterVisible = status;
  }
  maximizeDialogIfVisible() {
    if (this.pdfPreviewVisibility && this.yourDialog) {
      this.yourDialog.maximize();
    }
  }
  ngAfterViewInit() {
    this.maximizeDialogIfVisible();
    console.log('run ng after view init');
  }
  onHideFilePreviewEvent() {
    this.pdfUrl = '';
    this.safePdfUrl = '';
    this.pdfLoaded = false;
  }
  checkFormInvalid(): boolean {
    return (
      this.issueForm.controls?.['documentName']?.invalid &&
      (this.issueForm.controls?.['documentName']?.touched ||
        this.issueForm.controls?.['documentName']?.dirty)
    );
  }
}
