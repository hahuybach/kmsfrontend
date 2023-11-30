import {StatusResponse} from "./status-response";
import {IssueResponse} from "./issue-response";
import {SchoolResponse} from "./school-response";

export interface TaskTreeResponse{
  rootAssignmentId? : number,
  rootAssignmentName?: number,
  rootAssignmentStatus?: StatusResponse,
  issue?: IssueResponse,
  school?: SchoolResponse,
  status: any;
}
