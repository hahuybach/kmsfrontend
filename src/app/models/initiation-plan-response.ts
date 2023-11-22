import {IssueResponse} from "./issue-response";

export interface InitiationPlanResponse{
  initiationPlanId? : number,
  initiationPlanName? : string,
  createdDate?: Date,
  deadline? : Date,
  createdBy?: string,
  statusName: string,
  schoolName: string,
  issueName: string
}
