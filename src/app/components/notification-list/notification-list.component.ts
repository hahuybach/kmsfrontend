import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnChanges {
  badgeValue: string = "0";
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

  @Input() unseenNotificationDtos: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[];

  showAllNotification: boolean = true;

  onClickAllNotification(){
    this.showAllNotification = true;
  }

  onClickUnseenNotification(){
    this.showAllNotification = false;
  }

  clearBadge() {
    this.badgeValue = "0";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.notificationItems?.unseen != 0) {
      this.badgeValue = this.notificationItems?.unseen.toString();
    } else {
      this.badgeValue = "0";
    }
  }
}
