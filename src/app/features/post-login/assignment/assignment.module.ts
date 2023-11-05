import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssignmentService } from 'src/app/services/assignment.service';

@NgModule({
  declarations: [CreateAssignmentComponent],
  imports: [CommonModule, SharedModule],
  exports: [],
  providers: [AssignmentService],
})
export class AssignmentModule {}
