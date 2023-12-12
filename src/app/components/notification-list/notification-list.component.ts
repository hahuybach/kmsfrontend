import {Component, OnInit} from '@angular/core';
import {switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {StompService} from "../../features/post-login/push-notification/stomp.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  badgeValue: string = "0";
  user: string | null;
  notificationListDtos: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[]
  unseen: number

  unseenNotificationDtos: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[];

  showAllNotification: boolean = true;
  notificationPageSize: number = 10;
  notificationAllPageNumber: number = 1;
  notificationUnSeenPageNumber: number = 1;
  constructor(
    private http: HttpClient,
    private stompService: StompService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
  }

  onClickAllNotification() {
    this.resetScroll();
    this.showAllNotification = true;
  }

  onClickUnseenNotification() {
    this.resetScroll();
    this.showAllNotification = false;
  }

  resetScroll() {
    const notificationListElement = document.querySelector('.notification-item-list');
    if (notificationListElement) {
      notificationListElement.scrollTop = 0;
    }
  }

  ngOnInit(): void {
    this.getNotification();
    this.user = this.authService.getSubFromCookie();
    this.stompService.subscribe('/notify/' + this.user, (): any => {
      this.getNotification();
    })
  }

  private getNotification(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          return this.stompService.getAllNotification();
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.notificationListDtos = data.notificationListDtos;
          this.unseen = data.unseen;
          this.unseenNotificationDtos = data.unseenNotificationListDtos;
          if (data.unseen != 0) {
            this.badgeValue = this.unseen < 99 ? this.unseen.toString() : "99+";
          } else {
            this.badgeValue = "0";
          }
        },
        error: (error) => {
          console.log(error)
        }
      });
  }


  onNotificationListScroll(e: any) {
    const element = e.target as HTMLElement;
    console.log(element.offsetHeight);
    console.log(element.scrollTop);
    console.log(element.scrollHeight);
    if ((element.offsetHeight + element.scrollTop + 1) >= element.scrollHeight) {
      if (this.showAllNotification) {
        this.stompService.getNextNotification(this.notificationAllPageNumber ,true).subscribe({
          next: (data) => {
            console.log(data)
            this.notificationListDtos.push(...data.notificationListDtos);
            console.log(this.notificationListDtos);
            this.notificationAllPageNumber++;
          }
        })
      } else {
        this.stompService.getNextNotification(this.notificationUnSeenPageNumber ,false).subscribe({
          next: (data) => {
            console.log(data)
            this.unseenNotificationDtos.push(...data.notificationListDtos);
            this.notificationUnSeenPageNumber++;
          }
        })
      }
    }
  }
}
