import {DocumentResponse} from "./document-response";
import {AccountResponse} from "./account-response";

export interface FilterGuidanceDocumentResponse {
  guidanceDocumentId?: number,
  guidanceDocumentName?: string,
  createdDate?: Date,
  description?: string,
  documentDtos?: DocumentResponse[]
  accountDto?: AccountResponse

}
