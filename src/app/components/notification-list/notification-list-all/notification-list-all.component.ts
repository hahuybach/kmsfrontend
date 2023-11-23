import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-notification-list-all',
  templateUrl: './notification-list-all.component.html',
  styleUrls: ['./notification-list-all.component.scss']
})
export class NotificationListAllComponent {
  @Input() notificationItems: {
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

  constructor(
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
  }

  handleCLickNotificationItem(index: number) {
    let notificationId: number = this.notificationItems.notificationListDtos[index].notificationId;
    this.notificationService.notificationIsSeen(notificationId).subscribe({
      next: (response) => {
        console.log(response);
      }
    });
    let link: string = this.notificationItems.notificationListDtos[index].link;
    console.log(link.toString())
    this.router.navigateByUrl(link.toString());
  }
}
