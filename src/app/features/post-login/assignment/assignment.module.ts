import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreateAssignmentComponent],
  imports: [CommonModule, SharedModule],
})
export class AssignmentModule {}
