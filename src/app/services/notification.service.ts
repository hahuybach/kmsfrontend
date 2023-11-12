import { Injectable } from '@angular/core';
import {LoggerService} from "./LoggerService";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private inspectionApiUrl = 'http://localhost:8080/api/v1/inspection_plan';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Notification service constructed');
  }
}
