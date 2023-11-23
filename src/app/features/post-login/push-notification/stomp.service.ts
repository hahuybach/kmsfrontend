import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {LoggerService} from "../../../services/LoggerService";

@Injectable({
  providedIn: 'root'
})
export class StompService{
  private notificationApiUrl = 'http://localhost:8080/api/v1/notification';
  socket = new SockJs('http://localhost:8080/ws');
  stompClient = Stomp.over(this.socket);

  constructor(private loggerService: LoggerService, private http: HttpClient) {
    this.loggerService.log('Notification service constructed');
  }

  subscribe(topic: string, callback: any):void {
    const connected: boolean = this.stompClient.connected;
    if (connected){
      this.subscribeToTopic(topic, callback);
      return;
    }

    this.stompClient.connect({}, ():any => {
      this.subscribeToTopic(topic, callback);
    })
  }

  private subscribeToTopic(topic: string, callback?:any): void {
    this.stompClient.subscribe(topic, ():any => {
      callback();
    })
  }

  public unsubscribe(url: string){
    this.stompClient.unsubscribe("/comment/" + url);
  }

  public disconnect() {
    if (this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  public getAllNotification(): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.notificationApiUrl}/list`;
    return this.http.get(url, { headers });
  }

  public getAllUnseenNotification(): Observable<any> {
    let headers = new HttpHeaders();
    const url = `${this.notificationApiUrl}/unseen_list`;
    return this.http.get(url, { headers });
  }
}

