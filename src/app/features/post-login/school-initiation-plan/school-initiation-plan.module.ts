import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolInitiationPlanDetailComponent } from './school-initiation-plan-detail/school-initiation-plan-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { InitiationplanService } from 'src/app/services/initiationplan.service';

@NgModule({
  declarations: [SchoolInitiationPlanDetailComponent],
  imports: [CommonModule, SharedModule],
  exports: [],
  providers: [InitiationplanService],
})
export class SchoolInitiationPlanModule {}
