import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit{

  badgeValue: string = "2";
  notificationItems: {
    createdOn: Date,
    isSeen: boolean,
    link: string,
    message: string,
    notificationId: number,
    notificationType: string
  }[] = [];
  ngOnInit() {
  }
  clearBadge(){
    this.badgeValue = "0";
  }
}
