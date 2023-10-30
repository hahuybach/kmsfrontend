import {AccountResponse} from "./account-response";
import {StatusResponse} from "./status-response";
import {DocumentTypeResponse} from "./document-type-response";

export interface DocumentResponse{
  documentId? : number,
  documentName? : string,
  account?: AccountResponse,
  documentCode?: string,
  documentLink?: string,
  uploadedDate?: Date,
  size?: number,
  status?: StatusResponse,
  sizeFormat?: string,
  documentType?: DocumentTypeResponse,
  fileExtension?: string
}
