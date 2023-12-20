import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute} from "@angular/router";
import {InspectionService} from "../../../services/inspection.service";
import {Inspection} from "../../../models/inspection";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit{
  sub: string | null;
  inspectionId: number;
  inspection: Inspection;
  tabs: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly inspectionService: InspectionService,
    private readonly authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.inspectionId = params['id'];
      this.inspectionService.getInspectionInformation(this.inspectionId).subscribe({
        next: (data) => {
          this.inspection = data;
        },
        error: (error) => {
          console.log(error)
        }
      })
      this.sub = this.authService.getSubFromCookie();
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
