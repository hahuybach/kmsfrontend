import {AccountResponse} from "./account-response";

export interface SchoolResponse{
  schoolId?: number,
  schoolName?: string,
  exactAddress?: string
  isActive?: boolean
  accountDtos: AccountResponse[]
}
