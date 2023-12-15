import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StompService} from "../../features/post-login/push-notification/stomp.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  user: string | null;
  isVisible = false;

  badgeValue: string = '0';
  notificationListDtos: {
    createdOn: Date;
    isSeen: boolean;
    link: string;
    message: string;
    notificationId: number;
    notificationType: string;
  }[];
  unseenNotificationDtos: {
    createdOn: Date;
    isSeen: boolean;
    link: string;
    message: string;
    notificationId: number;
    notificationType: string;
  }[];
  unseen: number;
  all: number;
  notificationAllIsLoaded: boolean = false;
  notificationUnSeenIsLoaded: boolean = false;
  notificationPageSize: number = 10;

  constructor(
    private http: HttpClient,
    private stompService: StompService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getNotification();
    this.user = this.authService.getSubFromCookie();
    this.stompService.subscribe('/notify/' + this.user, (): any => {
      this.getNotification();
    });
  }

  onNotificationListClose(){
    this.getNotification();
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
          this.notificationListDtos = data.notificationListDtos;
          this.all = data.all;
          this.unseen = data.unseen;
          if (this.all <= this.notificationPageSize) {
            this.notificationAllIsLoaded = true;
          }
          if (this.unseen <= this.notificationPageSize) {
            this.notificationUnSeenIsLoaded = true;
          }
          this.unseenNotificationDtos = data.unseenNotificationListDtos;
          if (data.unseen != 0) {
            this.badgeValue = this.unseen < 99 ? this.unseen.toString() : '99+';
          } else {
            this.badgeValue = '0';
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onClickUserProfile() {
    this.isVisible = !this.isVisible;
  }
}
