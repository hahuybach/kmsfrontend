import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit{
  inspectionId: number;
  tabs: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;

  constructor(
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.inspectionId = params['id'];
      console.log(this.inspectionId);
    })

    this.tabs = [
      { label: 'Thông tin', routerLink:`information`},
      { label: 'Văn bản của trường', routerLink:`school-document`},
      { label: 'Công việc của tôi', routerLink:`my-task`},
      { label: 'Văn bản kiểm tra', routerLink:`document`},
    ];
    this.activeTab = this.tabs[0];
  }
}
