import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DomainName} from "../shared/enum/domain-name";
@Injectable()
export class InspectorService {
  private issueApiUrl = DomainName.URL +  'api/v1/user/';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Inspector service constructed');
  }

  public getNoneInspectors(): Observable<any[]> {
    const url = `${this.issueApiUrl}nonInspectors`;
    return this.http.get<any[]>(url);
  }
}
