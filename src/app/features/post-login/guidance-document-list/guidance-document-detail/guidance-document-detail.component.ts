import {Component, OnInit} from '@angular/core';
import {FilterGuidanceDocumentResponse} from "../../../../models/filter-guidance-document-response";
import {GuidanceDocumentService} from "../../../../services/guidance-document.service";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-guidance-document-detail',
  templateUrl: './guidance-document-detail.component.html',
  styleUrls: ['./guidance-document-detail.component.scss']
})
export class GuidanceDocumentDetailComponent implements OnInit {
  guidanceDocumentId: number;
  guidanceDocument: FilterGuidanceDocumentResponse;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  pdfUrl: string | undefined;

  constructor(private guidanceDocumentService: GuidanceDocumentService
    , private route: ActivatedRoute,
              private sanitizer: DomSanitizer
              ) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.guidanceDocumentId = +params['id'];
          return this.guidanceDocumentService.getGuidanceDocumentById(this.guidanceDocumentId);
        })
      )
      .subscribe((data) => {
        this.guidanceDocument = data.guidanceDocument;
        console.log(this.guidanceDocument);
      });
  }

  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.guidanceDocumentService.readIssuePDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }


}
