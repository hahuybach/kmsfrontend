import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private issueApiUrl = 'http://localhost:8080/api/v1/issue';
  constructor(private http: HttpClient) {}

  downloadPdf(id: string): Observable<HttpResponse<Blob>> {
    const url = `http://localhost:8080/api/v1/issue/document/${id}`; // Replace with your API endpoint
    console.log(url);
    // Set the response type as 'blob' to handle binary files
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
