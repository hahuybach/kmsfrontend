import {user} from "./user.model";
import {SchoolResponse} from "./school-response";
import {RoleResponse} from "./role-response";

export interface AccountResponse {
  accountId?: number,
  email?: string,
  user?: user,
  school?: SchoolResponse,
  roles?: RoleResponse[]
}
