import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchoolListComponent } from './school-list.component';
import { SchoolUpdateComponent } from './school-update/school-update.component';
import { SchoolDetailComponent } from './school-detail/school-detail.component';
import { SchoolCreateComponent } from './school-create/school-create.component';
import { SchoolService } from 'src/app/services/school.service';

@NgModule({
  declarations: [
    SchoolListComponent,
    SchoolUpdateComponent,
    SchoolDetailComponent,
    SchoolCreateComponent,
  ],
  imports: [CommonModule, SharedModule],
  providers: [SchoolService],
})
export class SchoolListModule {}
