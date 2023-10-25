import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InspectionPlanListComponent} from "../inspection-plan-list.component";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {InspectionPlanDetailComponent} from "../inspection-plan-detail/inspection-plan-detail.component";
import {CreateInspectionPlanComponent} from "../create-inspection-plan/create-inspection-plan.component";
import {UpdateInspectionPlanComponent} from "../update-inspection-plan/update-inspection-plan.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../../shared/shared.module";
import {InputTextareaModule} from "primeng/inputtextarea";

@NgModule({
  declarations: [
    InspectionPlanListComponent,
    InspectionPlanDetailComponent,
    CreateInspectionPlanComponent,
    UpdateInspectionPlanComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    SharedModule
  ],
  exports:[
  ]
})
export class InspectionPlanModule { }
