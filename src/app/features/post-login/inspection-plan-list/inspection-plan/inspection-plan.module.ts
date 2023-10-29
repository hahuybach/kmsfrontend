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
import {
  InspectionPlanInspectorListComponent
} from "../component/inspection-plan-inspector-list/inspection-plan-inspector-list.component";
import {
  InspectionPlanInspectorPopupComponent
} from "../component/inspection-plan-inspector-popup/inspection-plan-inspector-popup.component";
import {InspectorService} from "../../../../services/inspector.service";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";

@NgModule({
  declarations: [
    InspectionPlanListComponent,
    InspectionPlanDetailComponent,
    CreateInspectionPlanComponent,
    UpdateInspectionPlanComponent,
    InspectionPlanInspectorListComponent,
    InspectionPlanInspectorPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports:[
  ],
  providers:[
    inspectionPlanService
  ]
})
export class InspectionPlanModule { }
