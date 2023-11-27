import { Injectable } from '@angular/core';
import {LoggerService} from "./LoggerService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private taskApiUrl = 'http://localhost:8080/api/v1/task';

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Task service constructed');
  }

  public saveTask(record?: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const url = `${this.taskApiUrl}/save`;
    return this.http.post(url, record, { headers });
  }
  public updateTask(record?: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const url = `${this.taskApiUrl}/update`;
    return this.http.put(url, record, { headers });
  }

  public updateTaskDocument(formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    const url = `${this.taskApiUrl}/updateDoc`;
    return this.http.put(url, formData);
  }

  public getRecordById(recordId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.taskApiUrl}/detail/${recordId}`;
    return this.http.get(url, {headers});
  }

  public deleteRecordById(recordId: number): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.taskApiUrl}/delete/${recordId}`;
    return this.http.delete(url, {headers});
  }

  public getInspectionMyTask(inspectionId: number | null): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.taskApiUrl}/my_task/${inspectionId}`;
    return this.http.get(url, {headers});
  }
}
