export interface User {
  userId: number;
  fullName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
}

export interface School {
  schoolId: number;
  schoolName: string;
  exactAddress: string;
  isActive: boolean;
}

export interface Role {
  roleId: number;
  roleName: string;
  isSchoolEmployee: boolean;
}

export interface Account {
  accountId: number;
  email: string;
  user: User;
  school: School;
  roles: Role[];
}

export interface Status {
  statusId: number;
  statusName: string;
  statusType: string;
}

export interface TaskDetailDto {
  taskId: number;
  taskName: string;
  deadline: string;
  document: any;
  assigner: Account;
  assignee: Account;
  status: Status;
  description: string;
  inspectionPlanId: number;
  canManipulate: boolean;
  isConclusion: any;
}

export interface RootObject {
  taskDetailDto: TaskDetailDto;
  isAssignee: boolean;
}
