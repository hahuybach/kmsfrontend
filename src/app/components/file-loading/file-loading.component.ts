import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-loading',
  templateUrl: './file-loading.component.html',
  styleUrls: ['./file-loading.component.scss'],
})
export class FileLoadingComponent {
  @Input({ required: true }) visible: boolean = false;
  @Input({ required: true }) progress: string = '';
}
