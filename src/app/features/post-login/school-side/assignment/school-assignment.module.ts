import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AssignmentService } from 'src/app/services/assignment.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssignAssignmentComponent } from './assign-assignment/assign-assignment.component';
import { ApproveAssignmentComponent } from './approve-assignment/approve-assignment.component';
import { SubmitAssignmentComponent } from './submit-assignment/submit-assignment.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AssignmentListComponent,
    AssignAssignmentComponent,
    ApproveAssignmentComponent,
    SubmitAssignmentComponent,
  ],
  imports: [CommonModule, SharedModule, FormsModule],
  providers: [AssignmentService],
})
export class SchoolAssignmentModule {}
