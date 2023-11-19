import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {TagModule} from 'primeng/tag';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {DropdownModule} from "primeng/dropdown";
import {FileSizePipePipe} from './pipes/file-size-pipe.pipe';
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {LoadingCompleteDialogComponent} from "../components/loading-complete-dialog/loading-complete-dialog.component";

@NgModule({
  declarations: [
    FileSizePipePipe,
    LoadingCompleteDialogComponent
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
    DropdownModule,
    FormsModule,
    NgbModule,
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
    FileSizePipePipe,
    DropdownModule,
    FormsModule,
    NgbModule,
    LoadingCompleteDialogComponent
  ],
})
export class SharedModule {
}
