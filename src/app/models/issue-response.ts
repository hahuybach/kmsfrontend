import {AccountResponse} from "./account-response";
import {DocumentResponse} from "./document-response";
import {StatusResponse} from "./status-response";

export interface IssueResponse{
  issueId?: number,
  issueName?: string,
  createdDate?: string,
  endDate?: string,
  account?: AccountResponse,
  inspectors?: AccountResponse[],
  documentDtos?: DocumentResponse[],
  status?: StatusResponse,
  description?: string,
  initiationPlanDeadline?: string


}
