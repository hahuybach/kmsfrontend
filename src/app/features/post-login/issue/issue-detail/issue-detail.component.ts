import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IssueService} from '../../../../services/issue.service';
import {switchMap} from 'rxjs';
import {FileService} from 'src/app/services/file.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {getFirstAndLastName, unSub} from 'src/app/shared/util/util';
import {Dialog} from 'primeng/dialog';
import {TuiPdfViewerOptions, TuiPdfViewerService} from '@taiga-ui/kit';
import {ToastService} from "../../../../shared/toast/toast.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss'],
})
export class IssueDetailComponent implements OnInit, OnDestroy {
  issueId: any;
  issue: any;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  invalidDoc: any[];
  popupInvalidDocVisible = false;
  sub: any[] = [];
  pdfPreviewVisibility: boolean = false;
  @ViewChild('pdfDialog') yourDialog!: Dialog;

  breadCrumb = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Danh sách kế hoạch kiểm tra',
      routerLink: '/issue/list',
    },
    {
      caption: 'Chi tiết kế hoạch kiểm tra'
    },
  ];
  isLoading: boolean = false;
  submitCompleted: boolean = false;
  canFinish: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private readonly pdfService: TuiPdfViewerService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
  }

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
        this.canFinish = data.issue.canFinish;
        console.log(data);
        console.log(this.issue);
      });
    this.sub.push(sub);
  }

  ngOnDestroy(): void {
    unSub(this.sub);
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

  maximizeDialogIfVisible() {
    if (this.pdfPreviewVisibility && this.yourDialog) {
      this.yourDialog.maximize();
    }
  }

  togglePopupInvalidDoc() {
    this.invalidDoc = this.issue.documentDtos.filter(
      (document: any) => document.status.statusId === 2
    );

    this.popupInvalidDocVisible = true;
  }

  onHideFilePreviewEvent() {
    this.pdfUrl = '';
    this.safePdfUrl = '';
    this.pdfLoaded = false;
  }

  getAvatar(fullName: string): string {
    return getFirstAndLastName(fullName);
  }



  finishIssue() {
    if (this.canFinish){
      this.isLoading = true;
      this.issueService.finishIssue(this.issueId).subscribe({
        next: (data) => {
          setTimeout(() => {
            this.ngOnInit()
            this.isLoading = false;
          }, 1500)
          this.submitCompleted = true;

        },
        error: (error) => {
          this.isLoading = false;
          this.submitCompleted = false
          this.toastService.showError('issue-detail', 'Lỗi', error.error.message)
        }
      })
    }

  }

  confirm() {

    this.confirmationService.confirm({
      message: 'Bạn có xác nhận muốn kết thúc kế hoạch kiểm tra không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.finishIssue()

      }, key: 'issue-detail-confirm'
    });
  }
}
