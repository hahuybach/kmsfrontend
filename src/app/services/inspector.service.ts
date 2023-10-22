import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class InspectorService {
  private mockApiUrl = 'https://jsonplaceholder.typicode.com';
  private issueApiUrl = 'http://localhost:8080/api/v1/user/';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Inspector service constructed');
  }
  public getInspectors(): Observable<any[]> {
    const url = `${this.mockApiUrl}/users`;
    return this.http.get<any[]>(url);
  }
  public getInspectorById(id: number): Observable<any> {
    const url = `${this.mockApiUrl}/users/${id}`;
    return this.http.get(url);
  }
  public getNoneInspectors(): Observable<any[]> {
    const url = `${this.issueApiUrl}nonInspectors`;
    return this.http.get<any[]>(url);
  }
}
