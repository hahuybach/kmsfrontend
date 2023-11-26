import {Component, Input} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FileService} from "../../../../../services/file.service";
import {Document} from "../../../../../models/inspection";

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent {

  @Input() document: Document;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  pdfPreviewVisibility: boolean = false;

  constructor(
    private readonly fileService: FileService,
    private sanitizer: DomSanitizer
  ) {
  }

  openNewTab(documentLink: string) {
    this.pdfPreviewVisibility = true;
    this.fileService.readInitiationplanPDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }
}
