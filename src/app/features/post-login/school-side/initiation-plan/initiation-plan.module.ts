import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitiationPlanDetailComponent } from './initiation-plan-detail/initiation-plan-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InitiationplanService } from 'src/app/services/initiationplan.service';

@NgModule({
  declarations: [InitiationPlanDetailComponent],
  imports: [CommonModule, SharedModule],
  providers: [InitiationplanService]
})
export class InitiationPlanModule {}
