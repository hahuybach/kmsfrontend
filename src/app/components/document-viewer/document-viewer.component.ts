import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from 'src/app/services/file.service';
@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
})
export class DocumentViewerComponent {
  @Input() documentUrl: SafeUrl;

  constructor(
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const documentUrl = 'your_api_endpoint'; // Replace with the actual API endpoint
    this.fileService.getBlob(documentUrl).subscribe((blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    });
  }
}
