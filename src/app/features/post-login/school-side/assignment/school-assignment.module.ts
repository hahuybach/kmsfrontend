import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AssignmentService } from 'src/app/services/assignment.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AssignmentListComponent],
  imports: [CommonModule, SharedModule],
  providers: [AssignmentService],
})
export class SchoolAssignmentModule {}
