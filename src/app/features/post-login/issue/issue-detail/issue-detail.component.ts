import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from '../../../../services/issue.service';
import { switchMap } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { unSub } from 'src/app/shared/util/util';
import { Dialog } from 'primeng/dialog';
import { TuiPdfViewerOptions, TuiPdfViewerService } from '@taiga-ui/kit';

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


  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private readonly pdfService: TuiPdfViewerService
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
}
