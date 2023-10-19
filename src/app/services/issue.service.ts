import { Injectable } from "@angular/core";
import { Issue } from "../models/issue.model";
import { LoggerService } from "./LoggerService";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormGroup} from "@angular/forms";
@Injectable()
export class IssueService{
    private mockApiUrl = 'https://636b1436b10125b78feac415.mockapi.io'
    private issueApiUrl = "localhost:8080/api/v1/issue";
    constructor(private loggerService: LoggerService,private http: HttpClient){
        this.loggerService.log("Product service constructed")
    }
    public getIssues() : Observable<any[]>{
        const url = `${this.mockApiUrl}/issue`
        // let issues: Issue[];
        // issues = [new Issue(1,'Ke hoach nam hoc 2022-2023','1/1/2023',3,4,"nguyen van a"),new Issue(2,'Ke hoach nam hoc 2021-2022','1/1/2022',5,42,"nguyen van b")]
        // this.loggerService.log(issues)
        return this.http.get<any[]>(url);
    }
    public getIssueById(issueId: number) : Observable<any>{
      const url  = `${this.mockApiUrl}/issue/${issueId}`;
      return this.http.get(url);
    }

}
