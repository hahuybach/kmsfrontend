import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
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
  notificationListDtos: any;
  user: string | null;
  isVisible = false;

  constructor(
    private http: HttpClient,
    private stompService: StompService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getNotification()
    this.user = this.authService.getSubFromCookie();
    this.stompService.subscribe('/notify/' + this.user, (): any => {
      this.getNotification()
    })
  }

  private getNotification(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          return this.stompService.getUnseenNotificationByAccountId();
        })
      )
      .subscribe({
        next: (data) => {
          this.notificationListDtos = data.notificationListDtos;
        },
        error: (error) => {
          console.log(error)
        }
      });
  }

  onClickUserProfile() {
    this.isVisible = !this.isVisible;
  }
}
