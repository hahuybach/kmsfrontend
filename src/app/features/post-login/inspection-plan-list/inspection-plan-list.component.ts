import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {inspectionPlanService} from "../../../services/inspectionplan.service";

@Component({
  selector: 'app-inspection-plan-list',
  templateUrl: './inspection-plan-list.component.html',
  styleUrls: ['./inspection-plan-list.component.scss'],
})
export class InspectionPlanListComponent implements OnInit{
  inspectionPlanList: {
    inspectionPlanName: string,
    schoolName: string,
    chiefName: string,
    createdDate: Date
  }[];
  constructor(
    private readonly router: Router,
    private readonly inspectionPlanService: inspectionPlanService,
  ) {}

  ngOnInit(): void {
    this.inspectionPlanService.getInspectionPlans().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (error) => {
        console.log(error)
       }
    })
  }


}
