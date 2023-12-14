import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TreeTableModule } from 'primeng/treetable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FileSizePipePipe } from './pipes/file-size-pipe.pipe';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingCompleteDialogComponent } from '../components/loading-complete-dialog/loading-complete-dialog.component';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { TabMenuModule } from 'primeng/tabmenu';
import { FileLoadingComponent } from '../components/file-loading/file-loading.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PrimeNGConfig } from 'primeng/api';
import {TuiInputDateModule, TuiInputDateRangeModule, TuiBreadcrumbsModule, TuiAvatarModule} from '@taiga-ui/kit';
import { DataNotExistComponent } from '../components/data-not-exist/data-not-exist.component';
import {CheckboxModule} from "primeng/checkbox";
import {TuiRingChartModule} from '@taiga-ui/addon-charts';
import {TuiMoneyModule} from '@taiga-ui/addon-commerce';
import { StepsModule } from 'primeng/steps';

// ...

@NgModule({
  imports: [
    // ...
  ],
  // ...
})
export class MyModule {}

@NgModule({
  declarations: [
    FileSizePipePipe,
    LoadingCompleteDialogComponent,
    FileLoadingComponent,
    DataNotExistComponent,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    CalendarModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    TreeModule,
    ContextMenuModule,
    TreeTableModule,
    DropdownModule,
    DropdownModule,
    FormsModule,
    NgbModule,
    MenuModule,
    ChartModule,
    TabMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    TuiInputDateModule,
    TuiInputDateRangeModule,
    TuiBreadcrumbsModule,
    CheckboxModule,
    TuiRingChartModule,
    TuiMoneyModule,
    TuiAvatarModule,
    TuiAvatarModule,
    StepsModule
  ],
  exports: [
    InputTextModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    CalendarModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    TreeModule,
    ContextMenuModule,
    TreeTableModule,
    DropdownModule,
    FileSizePipePipe,
    DropdownModule,
    FormsModule,
    NgbModule,
    LoadingCompleteDialogComponent,
    MenuModule,
    ChartModule,
    TabMenuModule,
    FileLoadingComponent,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    TuiInputDateModule,
    DataNotExistComponent,
    TuiInputDateRangeModule,
    TuiBreadcrumbsModule,
    CheckboxModule,
    TuiRingChartModule,
    TuiMoneyModule,
    TuiAvatarModule,
    TuiAvatarModule,
    StepsModule
  ],
})
export class SharedModule {
  constructor(private primeNGConfig: PrimeNGConfig) {
    // Set custom translations for all tables
    this.primeNGConfig.setTranslation({
      matchAll: 'Trùng tất cả',
      matchAny: 'Trùng bất kỳ',
      startsWith: 'Bắt đầu bằng',
      contains: 'Bao gồm',
      notContains: 'Không bao gồm',
      endsWith: 'Kết thúc bằng',
      equals: 'Bằng',
      notEquals: 'Không bằng',
      noFilter: 'Bỏ lọc',
      lt: 'Bé hơn',
      addRule: 'Thêm điều kiện',
      removeRule: 'Bỏ điều kiện',
      dateAfter: 'Sau',
      dateBefore: 'Trước',
      clear: 'Xóa',
      apply: 'Áp dụng',
      dateIs: 'Ngày chính xác',
      dateIsNot: 'Không phải ngày',
      lte: 'Bé hơn bằng',
      gte: 'Lớn hơn bằng',
      gt: 'Lớn hơn',
    });
  }
}
