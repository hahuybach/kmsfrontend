import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InspectionComponent} from "./inspection.component";
import {InspectionInformationComponent} from "./inspection-information/inspection-information.component";
import {SharedModule} from "../../../shared/shared.module";
import { InspectionSchoolDocumentComponent } from './inspection-school-document/inspection-school-document.component';
import { InspectionDocumentComponent } from './inspection-document/inspection-document.component';



@NgModule({
  declarations: [
    InspectionComponent,
    InspectionInformationComponent,
    InspectionSchoolDocumentComponent,
    InspectionDocumentComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class InspectionModule { }
