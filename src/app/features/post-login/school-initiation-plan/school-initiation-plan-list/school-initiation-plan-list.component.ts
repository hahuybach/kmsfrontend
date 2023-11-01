import { Component, OnInit } from '@angular/core';
import { InitiationplanService } from 'src/app/services/initiationplan.service';

@Component({
  selector: 'app-school-initiation-plan-list',
  templateUrl: './school-initiation-plan-list.component.html',
  styleUrls: ['./school-initiation-plan-list.component.scss'],
})
export class SchoolInitiationPlanListComponent implements OnInit {
  schoolInitPlanList: [];
  constructor(private initiationplanService: InitiationplanService) {}
  ngOnInit(): void {
    this.initiationplanService.getInitiationPlans().subscribe((data) => {
      console.log(data);
    });
  }
}
