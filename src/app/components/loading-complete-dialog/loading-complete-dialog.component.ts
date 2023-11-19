import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-complete-dialog',
  templateUrl: './loading-complete-dialog.component.html',
  styleUrls: ['./loading-complete-dialog.component.scss']
})
export class LoadingCompleteDialogComponent implements OnInit{
  @Input({required: true}) visible: boolean = false;
  @Input({required: true})  completed: boolean = false;
  @Input() category: string = "";
  categoryLowerCase: string = "";
  ngOnInit(): void {
    this.categoryLowerCase  = this.category.toLowerCase();
  }

}
