
import { Component, OnInit } from '@angular/core';
import { MenuItem} from 'primeng/api';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {
    badgeValue: string = "2";
    menuItems: MenuItem[] = [];
    notiItems: MenuItem[] = [];

  constructor() {}
  
  ngOnInit() {
      this.menuItems = [
        {
            label: 'User profile'
        },
        {
            separator: true
        },
        {
            label: 'Setting'
        },
    ];
    this.notiItems = [
        {
            label: 'Noti 1'
        },
        {
            separator: true
        },
        {
            label: 'Noti 2'
        },
    ];
  }
  clearBadge(){
    this.badgeValue = "0";
  }

}
