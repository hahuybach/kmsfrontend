import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StompService} from "../push-notification/stomp.service";
import {switchMap} from "rxjs";
import {ActivatedRoute} from '@angular/router';
import {AuthService} from "../../../services/auth.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

}
