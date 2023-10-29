import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-login-base',
  templateUrl: './login-base.component.html',
  styleUrls: ['./login-base.component.scss']
})
export class LoginBaseComponent {
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.errorMessage = params['error'];
      if (this.errorMessage) {
        console.log(this.errorMessage)
        this.messageService.add({
          severity: 'danger',
          summary: 'Lỗi',
          detail: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại'
        })
      }
    });
  }
}
