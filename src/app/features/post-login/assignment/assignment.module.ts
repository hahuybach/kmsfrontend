import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssignmentService } from 'src/app/services/assignment.service';
import { AssignmentTreeListComponent } from './assignment-tree-list/assignment-tree-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis.pipe';

@NgModule({
  declarations: [
    CreateAssignmentComponent,
    AssignmentTreeListComponent,
    AssignmentDetailComponent,
  ],
  imports: [CommonModule, SharedModule, NgxPaginationModule],
  exports: [],
  providers: [AssignmentService],
})
export class AssignmentModule {}
