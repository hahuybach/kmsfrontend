import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AssignmentService } from 'src/app/services/assignment.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssignAssignmentComponent } from './assign-assignment/assign-assignment.component';
import { FormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis.pipe';
@NgModule({
  declarations: [
    AssignmentListComponent,
    AssignAssignmentComponent,
  ],
  imports: [CommonModule, SharedModule, FormsModule, NgxDocViewerModule],
  providers: [AssignmentService],
  exports: [NgxDocViewerModule],
})
export class SchoolAssignmentModule {}
