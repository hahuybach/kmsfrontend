import { Injectable } from "@angular/core";
import { LoggerService } from "./LoggerService";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class IssueService{
    private mockApiUrl = 'https://636b1436b10125b78feac415.mockapi.io'
    constructor(private loggerService: LoggerService,private http: HttpClient){
        this.loggerService.log("Issue service constructed")
    }
    public getIssues() : Observable<any[]>{
        const url = `${this.mockApiUrl}/issue`
        return this.http.get<any[]>(url);
    }
    public getIssueById(issueId: number) : Observable<any>{
      const url  = `${this.mockApiUrl}/issue/${issueId}`;
      return this.http.get(url);
    }
}
