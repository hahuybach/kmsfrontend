export class Issue{
    id: number;
    docName: string;
    createdDate:string;
    docNum: number;
    inspectorNum: number;
    createdBy: string;


  constructor(id:number,docName: string, createdDate: string, docNum: number, inspectorNum: number, createdBy: string) {
    this.id = id;
    this.docName = docName;
    this.createdDate = createdDate;
    this.docNum = docNum;
    this.inspectorNum = inspectorNum;
    this.createdBy = createdBy;
  }
}
