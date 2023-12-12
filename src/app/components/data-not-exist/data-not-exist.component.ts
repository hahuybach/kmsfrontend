import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-data-not-exist',
  templateUrl: './data-not-exist.component.html',
  styleUrls: ['./data-not-exist.component.scss']
})
export class DataNotExistComponent {
  @Input({required: true}) message: string;
  //VD: Kế hoạch kiểm tra không tồn tại
}
