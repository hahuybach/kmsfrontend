import {Component, Input, OnInit} from '@angular/core';
import { switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StompService } from '../../features/post-login/push-notification/stomp.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  badgeValue: string = '0';
  user: string | null;
  @Input() notificationListDtos: {
    createdOn: Date;
    isSeen: boolean;
    link: string;
    message: string;
    notificationId: number;
    notificationType: string;
  }[];
  @Input() unseenNotificationDtos: {
    createdOn: Date;
    isSeen: boolean;
    link: string;
    message: string;
    notificationId: number;
    notificationType: string;
  }[];
  @Input() unseen: number;
  @Input() all: number;
  showAllNotification: boolean = true;
  @Input() notificationPageSize: number = 10;
  notificationAllPageNumber: number = 1;
  notificationAllIsLoaded: boolean = false;
  notificationUnSeenPageNumber: number = 1;
  notificationUnSeenIsLoaded: boolean = false;

  constructor(
    private http: HttpClient,
    private stompService: StompService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  onClickAllNotification() {
    this.resetScroll();
    this.showAllNotification = true;
  }

  onClickUnseenNotification() {
    this.resetScroll();
    this.showAllNotification = false;
  }

  resetScroll() {
    const notificationListElement = document.querySelector(
      '.notification-item-list'
    );
    if (notificationListElement) {
      notificationListElement.scrollTop = 0;
    }
  }


  onNotificationClose(e: any) {
    if (!e) {
      this.resetNotificationList();
      this.getNotification();
    }
  }

  resetNotificationList() {
    this.notificationAllIsLoaded = false;
    this.notificationUnSeenIsLoaded = false;
    this.notificationAllPageNumber = 1;
    this.notificationUnSeenPageNumber = 1;
    this.notificationListDtos = [];
    this.unseenNotificationDtos = [];
  }

  onNotificationListScroll(e: any) {
    const element = e.target as HTMLElement;
    if (element.offsetHeight + element.scrollTop + 1 >= element.scrollHeight) {
      if (this.showAllNotification && this.all >= this.notificationPageSize) {
        this.stompService
          .getNextNotification(this.notificationAllPageNumber, true)
          .subscribe({
            next: (data) => {
              this.notificationListDtos.push(...data.notificationListDtos);
              this.notificationAllPageNumber++;
              if (this.notificationListDtos.length === this.all) {
                this.notificationAllIsLoaded = true;
              }
            },
          });
      } else if (this.unseen >= this.notificationPageSize) {
        this.stompService
          .getNextNotification(this.notificationUnSeenPageNumber, false)
          .subscribe({
            next: (data) => {
              this.unseenNotificationDtos.push(...data.notificationListDtos);
              this.notificationUnSeenPageNumber++;
              if (this.unseenNotificationDtos.length == this.unseen) {
                this.notificationUnSeenIsLoaded = true;
              }
            },
          });
      }
    }
  }
}
