import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StompService} from "../../features/post-login/push-notification/stomp.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent{
}
