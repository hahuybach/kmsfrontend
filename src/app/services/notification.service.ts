import { Injectable } from '@angular/core';
import {LoggerService} from "./LoggerService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DomainName} from "../shared/enum/domain-name";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationApiUrl = DomainName.URL +  'api/v1/notification';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Notification service constructed');
  }

  public notificationIsSeen(notificationId: number): Observable<any[]> {
    let headers = new HttpHeaders();
    const url = `${this.notificationApiUrl}/seen/${notificationId}`;
    return this.http.get<any[]>(url, {headers});
  }

}
