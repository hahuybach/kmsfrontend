import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnChanges {

  constructor(
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
  }

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

  clearBadge() {
    this.badgeValue = "0";
  }

  handleCLickNotificationItem(index: number) {
    let notificationId: number = this.notificationItems.notificationListDtos[index].notificationId;
    this.notificationService.notificationIsSeen(notificationId).subscribe({
      next: (response) => {
        console.log(response);
      }
    });
    let link: string = this.notificationItems.notificationListDtos[index].link;
    this.router.navigateByUrl(link.toString());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.notificationItems?.unseen != 0) {
      this.badgeValue = this.notificationItems?.unseen.toString();
      console.log(this.notificationItems?.unseen)
    } else {
      this.badgeValue = "0";
    }
  }
}
