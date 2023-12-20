import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-notification-list-all',
  templateUrl: './notification-list-all.component.html',
  styleUrls: ['./notification-list-all.component.scss']
})
export class NotificationListAllComponent {
  @Input() notificationListDtos: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[]

  @Input() allNotificationLoaded: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
  }

  handleCLickNotificationItem(index: number) {
    let notificationId: number = this.notificationListDtos[index].notificationId;
    this.notificationService.notificationIsSeen(notificationId).subscribe({
      next: (response) => {
        console.log(response);
      }
    });
    let link: string = this.notificationListDtos[index].link;
    this.router.navigateByUrl(link.toString());
    if(this.notificationListDtos.length <= 10){
      this.allNotificationLoaded = true;
    }
  }
}
