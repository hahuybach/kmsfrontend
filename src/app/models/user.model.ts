import {AccountResponse} from "./account-response";

export interface user{
  userId?: number,
  fullName?: string,
  dob?: string,
  gender?: string,
  phoneNumber?: string,
  account?: AccountResponse
}
