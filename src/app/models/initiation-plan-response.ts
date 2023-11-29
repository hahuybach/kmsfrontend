import {IssueResponse} from "./issue-response";
import {StatusResponse} from "./status-response";

export interface InitiationPlanResponse{
  initiationPlanId? : number,
  initiationPlanName? : string,
  createdDate?: Date,
  deadline? : Date,
  createdBy?: string,
  statusName: string,
  schoolName: string,
  issueName: string,
  status: any
}
