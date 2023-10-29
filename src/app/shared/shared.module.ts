import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DialogModule} from "primeng/dialog";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    DialogModule
  ],
  exports:[
    InputTextModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    DialogModule
  ]
})
export class SharedModule { }
