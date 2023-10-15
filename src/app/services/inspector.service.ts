import { Injectable } from '@angular/core';
import { LoggerService } from './LoggerService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class InspectorService {
  private mockApiUrl = 'https://jsonplaceholder.typicode.com';
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
}
