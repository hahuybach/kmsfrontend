import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit{
  tabs: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  ngOnInit(): void {
    this.tabs = [
      { label: 'Thông tin', routerLink:'information'},
      { label: 'Văn bản của trường', routerLink:'school-document'},
      { label: 'Văn bản kiểm tra', routerLink:'document'},
    ];
    this.activeTab = this.tabs[0];
  }
}
