import {Component, Input} from '@angular/core';
import {DocumentResponse} from "../../../../../models/document-response";

@Component({
  selector: 'app-guidance-document-files',
  templateUrl: './guidance-document-files.component.html',
  styleUrls: ['./guidance-document-files.component.scss']
})
export class GuidanceDocumentFilesComponent {
  @Input()
  documentResponse: DocumentResponse
}
