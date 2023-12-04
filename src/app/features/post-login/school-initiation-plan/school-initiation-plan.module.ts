import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolInitiationPlanDetailComponent } from './school-initiation-plan-detail/school-initiation-plan-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { InitiationplanService } from 'src/app/services/initiationplan.service';
import { SchoolInitiationPlanListComponent } from './school-initiation-plan-list/school-initiation-plan-list.component';
import {NgxPaginationModule} from "ngx-pagination";
import { SchoolInitiationPlanBaseComponent } from './school-initiation-plan-base/school-initiation-plan-base.component';

@NgModule({
  declarations: [SchoolInitiationPlanDetailComponent, SchoolInitiationPlanListComponent, SchoolInitiationPlanBaseComponent],
    imports: [CommonModule, SharedModule, NgxPaginationModule],
  exports: [],
  providers: [InitiationplanService],
})
export class SchoolInitiationPlanModule {}
