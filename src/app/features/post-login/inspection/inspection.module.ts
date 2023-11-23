import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InspectionComponent} from "./inspection.component";
import {InspectionInformationComponent} from "./inspection-information/inspection-information.component";
import {SharedModule} from "../../../shared/shared.module";
import { InspectionSchoolDocumentComponent } from './inspection-school-document/inspection-school-document.component';
import { InspectionDocumentComponent } from './inspection-document/inspection-document.component';
import { FileItemComponent } from './component/file-item/file-item.component';
import {InspectionPlanModule} from "../inspection-plan-list/inspection-plan/inspection-plan.module";
import { CreateRecordComponent } from './record/create-record/create-record.component';
import { UpdateRecordComponent } from './record/update-record/update-record.component';



@NgModule({
  declarations: [
    InspectionComponent,
    InspectionInformationComponent,
    InspectionSchoolDocumentComponent,
    InspectionDocumentComponent,
    FileItemComponent,
    CreateRecordComponent,
    UpdateRecordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InspectionPlanModule
  ]
})
export class InspectionModule { }
