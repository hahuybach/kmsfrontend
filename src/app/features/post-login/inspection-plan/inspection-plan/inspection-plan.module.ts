import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InspectionPlanListComponent} from "../inspection-plan-list/inspection-plan-list.component";
import {InspectionPlanDetailComponent} from "../inspection-plan-detail/inspection-plan-detail.component";
import {CreateInspectionPlanComponent} from "../create-inspection-plan/create-inspection-plan.component";
import {UpdateInspectionPlanComponent} from "../update-inspection-plan/update-inspection-plan.component";
import {SharedModule} from "../../../../shared/shared.module";
import {
  InspectionPlanInspectorListComponent
} from "../component/inspection-plan-inspector-list/inspection-plan-inspector-list.component";
import {
  InspectionPlanInspectorPopupComponent
} from "../component/inspection-plan-inspector-popup/inspection-plan-inspector-popup.component";
import {inspectionPlanService} from "../../../../services/inspectionplan.service";
import {RouterLink} from "@angular/router";
import {NgxPaginationModule} from "ngx-pagination";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiValueChangesModule} from "@taiga-ui/cdk";
import {TuiUnfinishedValidatorModule} from "@taiga-ui/kit";

@NgModule({
  declarations: [
    InspectionPlanListComponent,
    InspectionPlanDetailComponent,
    CreateInspectionPlanComponent,
    UpdateInspectionPlanComponent,
    InspectionPlanInspectorListComponent,
    InspectionPlanInspectorPopupComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterLink,
        NgxPaginationModule,
        TuiTextfieldControllerModule,
        TuiValueChangesModule,
        TuiUnfinishedValidatorModule,
    ],
    exports: [
        InspectionPlanInspectorListComponent
    ],
  providers:[
    inspectionPlanService
  ]
})
export class InspectionPlanModule {}
