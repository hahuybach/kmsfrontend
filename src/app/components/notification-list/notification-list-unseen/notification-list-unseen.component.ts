import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-notification-list-unseen',
  templateUrl: './notification-list-unseen.component.html',
  styleUrls: ['./notification-list-unseen.component.scss']
})
export class NotificationListUnseenComponent {
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
}
