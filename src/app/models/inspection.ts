interface User {
  userId: number;
  fullName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
}

// Define the School interface
interface School {
  schoolId: number;
  schoolName: string;
  exactAddress: string;
  isActive: boolean;
}

// Define the Role interface
interface Role {
  roleId: number;
  roleName: string;
  isSchoolEmployee: boolean;
}

// Define the Inspector interface
interface Inspector {
  email: string;
  accountId: number;
  user: User;
  school: School;
  roles: Role[];
  chief: boolean;
}

// Define the DocumentType interface
interface DocumentType {
  documentTypeId: number;
  documentTypeName: string;
  documentType: string;
}

// Define the DocumentStatus interface
interface DocumentStatus {
  statusId: number;
  statusName: string;
  statusType: string;
}

// Define the Document interface
export interface Document {
  documentId: number;
  documentName: string;
  documentCode: string;
  documentType: DocumentType;
  documentLink: string;
  uploadedDate: string;
  size: number;
  status: DocumentStatus;
  fileExtension: string;
}

interface InspectionPlanDocument extends Document {
}

// Define the IssueDocument interface
interface IssueDocument extends Document {
}

interface IniDocument extends Document {
}

export interface Inspection {
  inspectionName: string;
  schoolName: string;
  statusName: string;
  startDate: string;
  endDate: string;
  inspectorDtos: Inspector[];
  inspectionPlanDocument: InspectionPlanDocument;
  issueDocuments: IssueDocument[];
  iniDocument: IniDocument;
}

export interface TaskListDto {
  taskId: number;
  taskName: string;
  assigneeName: string;
  deadline: Date;
  statusName: string;
  canManipulate: boolean;
  canAlterDoc: boolean;

}

export interface Record{

}

export interface InspectionDocument {
  index: number;
  taskListDtos: TaskListDto[];
  reportId: number;
  conclusionId: number;
  canFinish: boolean;
  canUploadFinalDoc: boolean;
  canCreateTask: boolean;
  isChief: boolean;
}


