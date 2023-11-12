import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StompService} from "../push-notification/stomp.service";
import {switchMap} from "rxjs";
import {ActivatedRoute} from '@angular/router';
import {AuthService} from "../../../services/auth.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    notificationListDtos: any;
    user: string | null;

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
        this.stompService.subscribe( '/notify/'+ this.user, (): any => {
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
            .subscribe((data) => {
                this.notificationListDtos = data.notificationListDtos;
                console.log(this.notificationListDtos);
            });
    }
}
