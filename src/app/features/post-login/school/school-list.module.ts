import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchoolListComponent } from './school-list/school-list.component';
import { SchoolUpdateComponent } from './school-update/school-update.component';
import { SchoolDetailComponent } from './school-detail/school-detail.component';
import { SchoolCreateComponent } from './school-create/school-create.component';
import { SchoolService } from 'src/app/services/school.service';
import { SchoolBaseComponent } from './school-base/school-base.component';
import {TuiUnfinishedValidatorModule} from "@taiga-ui/kit";

@NgModule({
  declarations: [
    SchoolListComponent,
    SchoolUpdateComponent,
    SchoolDetailComponent,
    SchoolCreateComponent,
    SchoolBaseComponent,
  ],
  imports: [CommonModule, SharedModule, TuiUnfinishedValidatorModule],
  providers: [SchoolService],
})
export class SchoolListModule {}
