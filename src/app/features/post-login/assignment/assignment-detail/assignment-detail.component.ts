import { error } from '@angular/compiler-cli/src/transformers/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from 'src/app/services/assignment.service';
import { DocumentService } from 'src/app/services/document.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss'],
})
export class AssignmentDetailComponent implements OnInit {
  assignments: any;
  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const issueId = +params['issueId'];
      const schoolId = +params['schoolId'];
      console.log(issueId + '_' + schoolId);
      this.documentService
        .getAssignmentsBySchoolId(issueId, schoolId)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.assignments = data;
          },
          error: (error) => {
            this.toastService.showError('error', 'Lỗi', error.error.message);
          },
        });
    });
  }
  openDetail(rowNode: any) {}
}
