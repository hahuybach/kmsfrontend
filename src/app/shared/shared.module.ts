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
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  declarations: [
    FileSizePipePipe,
    LoadingCompleteDialogComponent,
    FileLoadingComponent,
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
    MatFormFieldModule
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
    MatFormFieldModule
  ],
})
export class SharedModule {}
