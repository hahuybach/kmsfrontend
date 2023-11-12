import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { switchMap } from 'rxjs';
import { AssignmentService } from 'src/app/services/assignment.service';
import { FileService } from 'src/app/services/file.service';
import { IssueService } from 'src/app/services/issue.service';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-approve-assignment',
  templateUrl: './approve-assignment.component.html',
  styleUrls: ['./approve-assignment.component.scss'],
})
export class ApproveAssignmentComponent implements OnInit {
  assignments: any[];
  selectedAssignment: any;
  assVisible = false;
  newAssigneeName: string;
  documents: any[] = [];
  assignmentForm: FormGroup;
  issueId: number;
  statusForm: FormGroup;
  pdfUrl: string | undefined;
  pdfLoaded: boolean = false;
  safePdfUrl: SafeResourceUrl | undefined;
  @ViewChild('dropdown') dropdown: Dropdown;
  selectedValue: any;
  commentForm = this.fb.group({
    content: ['', Validators.required],
    userName: ['', Validators.required],
    createdDate: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private issueService: IssueService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.issueService
      .getCurrentActiveIssue()
      .pipe(
        switchMap((data) => {
          console.log(data);
          this.issueId = data.issueDto.issueId;
          return this.assignmentService.getAssignmentsToApprove(
            data.issueDto.issueId
          );
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.assignments = data.assignmentListDtos;
        console.log(this.assignments);
      });
    this.assignmentForm = this.fb.group({
      status: ['', Validators.required],
    });
  }

  initData() {
    this.issueService
      .getCurrentActiveIssue()
      .pipe(
        switchMap((data) => {
          console.log(data);
          this.issueId = data.issueDto.issueId;
          return this.assignmentService.getAssignmentsToApprove(
            data.issueDto.issueId
          );
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.assignments = [data];
        console.log(this.assignments);
      });
  }
  statusOptions = [
    {
      label: 'Chờ phê duyệt',
      value: 'Chờ phê duyệt',
      severity: 'warning',
      disabled: true,
    },
    {
      label: 'Phê duyệt',
      value: true,
      severity: 'success',
      disabled: false,
    },
    {
      label: 'Không phê duyệt',
      value: false,
      severity: 'danger',
      disabled: false,
    },
  ];

  assVisibleToggle(assignment: any) {
    console.log(assignment);
    this.assignmentService
      .getAssignmentsById(assignment.assignmentId)
      .subscribe((data) => {
        this.selectedAssignment = data;
        this.documents = data.documents;
        const statusControl = this.assignmentForm.get('status');
        if (statusControl) {
          statusControl.setValue(data.status.statusName);
        }
      });
    this.assVisible = true;
  }
  sendComment() {
    console.log(this.commentForm.get('content')?.value);
    this.selectedAssignment.comments.unshift({
      content: this.commentForm.get('content')?.value,
      userName: 'tran le hai',
      createdDate: new Date(),
    });
    this.commentForm.reset();
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendComment();
    }
  }
  getStatusSeverity(statusId: number): string {
    const statusSeverityMap: { [key: number]: string } = {
      16: 'warning',
      17: 'success',
      18: 'danger',
    };

    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }
  openNewTab(documentLink: string) {
    console.log(documentLink);
    this.fileService.readIssuePDF(documentLink).subscribe((response) => {
      const blobUrl = window.URL.createObjectURL(response.body as Blob);
      this.pdfUrl = blobUrl;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfLoaded = true;
    });
  }
  displayNewFileUpload(file: File) {
    const blobUrl = window.URL.createObjectURL(file as Blob);
    this.pdfUrl = blobUrl;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.pdfLoaded = true;
  }
  onChangeStatus(event: any) {
    const selectedStatus = event.value;
        console.log('Selected Status:', selectedStatus);
        const data = {
          assignmentId: this.selectedAssignment.assignmentId,
          isPassed: selectedStatus,
        };
        console.log(data);
        const formData = new FormData();
        formData.append(
          'task',
          new Blob([JSON.stringify(data)], {
            type: 'application/json',
          })
        );

        this.assignmentService.evaluateAssignment(formData).subscribe({
          next: () => {
            console.log('success');
          },
          error: (error) => {
            console.log(error.error.message);
      },
    });
  }
}
