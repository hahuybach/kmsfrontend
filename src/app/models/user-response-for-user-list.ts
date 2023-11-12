import {SchoolResponse} from "./school-response";
import {AccountRoleDto} from "./account-role-dto";

export interface UserResponseForUserList{
    userId?: number,
    email?: string,
    fullName?: string,
    dob?: Date,
    gender?: string,
    phoneNumber?: string,
    isActive?: boolean,
    school?: SchoolResponse,
    accountRoles? : AccountRoleDto[]
}
