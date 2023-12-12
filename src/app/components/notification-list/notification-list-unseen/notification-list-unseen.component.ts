import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import _default from "chart.js/dist/core/core.interaction";

@Component({
  selector: 'app-notification-list-unseen',
  templateUrl: './notification-list-unseen.component.html',
  styleUrls: ['./notification-list-unseen.component.scss']
})
export class NotificationListUnseenComponent implements OnChanges{
  constructor(
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
  }

  @Input() unseenNotificationDtos: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[];

  @Input() allNotificationLoaded: boolean = false;

  handleCLickNotificationItem(index: number) {
    let notificationId: number = this.unseenNotificationDtos[index].notificationId;
    this.notificationService.notificationIsSeen(notificationId).subscribe({
      next: (response) => {
        console.log(response);
      }
    });
    let link: string = this.unseenNotificationDtos[index].link;
    this.router.navigateByUrl(link.toString());
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.allNotificationLoaded);
  }
}
