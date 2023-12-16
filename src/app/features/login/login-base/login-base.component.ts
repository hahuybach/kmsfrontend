import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
import {ToastService} from "../../../shared/toast/toast.service";

@Component({
  selector: 'app-login-base',
  templateUrl: './login-base.component.html',
  styleUrls: ['./login-base.component.scss']
})
export class LoginBaseComponent {
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private readonly toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.errorMessage = params['error'];
      if (this.errorMessage) {
        this.toastService.showError('login-base', 'Hết phiên đăng nhập', "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
      }
    });
  }
}
