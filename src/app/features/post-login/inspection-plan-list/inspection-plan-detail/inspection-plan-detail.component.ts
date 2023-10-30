import {Component, OnInit} from '@angular/core';
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-inspection-plan-detail',
  templateUrl: './inspection-plan-detail.component.html',
  styleUrls: ['./inspection-plan-detail.component.scss']
})
export class InspectionPlanDetailComponent implements OnInit {
  inspectionPlanId: number;
  inspectionPlan : {
    inspectionPlanId: number,
    inspectionPlanName: string,
    createdDate: Date,
    description: string,
    school: {
      schoolId: number,
      schoolName: string,
      exactAddress: string
    },
    documents: [
      {
        documentId: number,
        documentName: string,
        documentCode: string,
        documentType: {
          documentTypeId: number,
          documentTypeName: string,
          documentType: string
        },
        documentLink: string,
        uploadedDate: Date,
        size: number,
        status: {
          statusId: number,
          statusName: string,
          statusType: string
        },
        fileExtension: string
      }
    ],
    inspectorTeams: [
      {
        inspectorTeamId: {
          accountId: number,
          inspectionPlanId: number
        },
        chief: boolean
      },
      {
        inspectorTeamId: {
          accountId: number,
          inspectionPlanId: number
        },
        chief: boolean
      }
    ],
    startDate: Date,
    endDate: Date
  }

  constructor(
    private readonly inspectionPlanService: inspectionPlanService,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.inspectionPlanId = +params['id'];
          console.log(this.inspectionPlanId);
          return this.inspectionPlanService.getInspectionPlanById(this.inspectionPlanId);
        })
      ).subscribe({
      next: (data) => {
        console.log(data);
        this.inspectionPlan = data.inspectionPlan;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


}
