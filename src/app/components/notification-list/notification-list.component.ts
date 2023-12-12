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
  notificationItems: {
    notificationListDtos: {
      createdOn: Date,
      isSeen: boolean,
      link: string,
      message: string,
      notificationId: number,
      notificationType: string
    }[],
    unseen: number
  };

  unseenNotificationDtos: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[];

  showAllNotification: boolean = true;

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

  resetScroll(){
    const notificationListElement = document.querySelector('.notification-item-list');
    if (notificationListElement) {
      notificationListElement.scrollTop = 0;
    }
  }

  ngOnInit(): void {
    this.getNotification();
    this.getUnseenNotification();
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
          this.notificationItems = data;
          if (this.notificationItems?.unseen != 0) {
            this.badgeValue = this.notificationItems?.unseen < 99 ? this.notificationItems?.unseen.toString() : "99+";
          } else {
            this.badgeValue = "0";
          }
        },
        error: (error) => {
          console.log(error)
        }
      });
  }

  private getUnseenNotification(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          return this.stompService.getAllUnseenNotification();
        })
      )
      .subscribe({
        next: (data) => {
          this.unseenNotificationDtos = data.notificationListDtos;
        },
        error: (error) => {
          console.log(error)
        }
      });
  }


  onNotificationListScroll(e: any){
    const element = e.target as HTMLElement;
    if ((element.offsetHeight + element.scrollTop + 1) >= element.scrollHeight) {
      if (this.showAllNotification){
        console.log('end of notification all');
      }else{
        console.log('end of notification unseen');
      }
    }
  }
}
