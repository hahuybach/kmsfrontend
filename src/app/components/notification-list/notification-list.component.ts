import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnChanges{

  constructor(
    private readonly router: Router
  ) {
  }

  badgeValue: string = "0";
  @Input() notificationItems: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[] = [];
  clearBadge(){
    this.badgeValue = "0";
  }
  handleCLickNotificationItem(index: number){
    let link = this.notificationItems[index].link;
    this.router.navigateByUrl(link);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.notificationItems?.length != 0) {
      this.badgeValue = this.notificationItems?.length.toString();
    }else {
      this.badgeValue = "0";
    }
  }
}
