import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-complete-dialog',
  templateUrl: './loading-complete-dialog.component.html',
  styleUrls: ['./loading-complete-dialog.component.scss']
})
export class LoadingCompleteDialogComponent{
  @Input() width: number = 40;
  @Input() height: number = 50;
  @Input({required: true}) visible: boolean = false;
  @Input({required: true})  completed: boolean = false;
  @Input() failed: boolean = false;
  @Input({required: true}) header: string = ""; //Ex: Tạo mới quyết định kiểm tra
  @Input({required: true}) progress: string = ""; //Ex: Đang tạo quyết định kiểm tra
  @Input({required: true}) complete: string = ""; //Ex: Tạo quyết định kiểm tra thành công
  @Input() fail: string = ""; //Ex: Tạo quyết định kiểm tra không thành công

}
