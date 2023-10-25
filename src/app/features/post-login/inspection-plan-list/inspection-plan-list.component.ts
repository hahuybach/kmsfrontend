import {Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspection-plan-list',
  templateUrl: './inspection-plan-list.component.html',
  styleUrls: ['./inspection-plan-list.component.scss'],
})
export class InspectionPlanListComponent {
  inspectionplanlist!: any[];
  constructor(private router: Router) {}
  navigateToCreateInspectionPlan() {
    this.router.navigate(['/inspectionplan/create']);
  }
  navigateToDetail(inspectionplanId: number) {}
  navigateToUpdate(inspectionplanId: number) {}
}
