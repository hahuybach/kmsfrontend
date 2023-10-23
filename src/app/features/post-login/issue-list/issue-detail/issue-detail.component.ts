import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from '../../../../services/issue.service';
import { switchMap } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss'],
})
export class IssueDetailComponent implements OnInit {
  issueId: any;
  issue: any;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  invalidDoc: any[];
  popupInvalidDocVisible = false;
  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
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
      });
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
  togglePopupInvalidDoc() {
    this.invalidDoc = this.issue.documentDtos.filter(
      (document: any) => document.status.statusId === 2
    );

    this.popupInvalidDocVisible = true;
  }
}
