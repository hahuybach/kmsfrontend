import {DocumentResponse} from "./document-response";
import {AccountResponse} from "./account-response";
import {IssueResponse} from "./issue-response";

export interface FilterGuidanceDocumentResponse {
  guidanceDocumentId?: number,
  guidanceDocumentName?: string,
  createdDate?: Date,
  description?: string,
  documentDtos?: DocumentResponse[]
  accountDto?: AccountResponse
  issueDto?: IssueResponse


}
