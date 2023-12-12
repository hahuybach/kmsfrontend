import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskTreeResponse } from '../../../../models/task-tree-response';
import { IssueDropDownResponse } from '../../../../models/issue-drop-down-response';
import { SchoolResponse } from '../../../../models/school-response';
import { InitiationplanService } from '../../../../services/initiationplan.service';
import { SchoolService } from '../../../../services/school.service';
import { IssueService } from '../../../../services/issue.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { AssignmentService } from '../../../../services/assignment.service';
import { Role } from '../../../../shared/enum/role';
import { DocumentService } from '../../../../services/document.service';
import { unSub } from '../../../../shared/util/util';

@Component({
  selector: 'app-assignment-tree-list',
  templateUrl: './assignment-tree-list.component.html',
  styleUrls: ['./assignment-tree-list.component.scss'],
})
export class AssignmentTreeListComponent implements OnInit, OnDestroy {
  taskTrees: TaskTreeResponse[];
  assignmentName: string;
  advanceSearch: boolean = false;
  issueDropDowns: IssueDropDownResponse[];
  currentIssueSelected: any;
  advanceSearchButtonText = 'Hiện tra cứu nâng cao';
  schools: SchoolResponse[];
  selectedSchool: any;
  statuses = [
    { label: 'Chưa bắt đầu', value: 13 },
    { label: 'Chưa hoàn thành', value: 14 },
    { label: 'Hoàn thành', value: 15 },
  ];
  selectedStatus: any;
  pageNo: number = 1;
  pageSize: number = 5;
  sortBy: string = 'School.schoolName';
  sortDirection: string = 'desc';
  totalElements: number;
  maxPage: any;
  recordPerPageOption: number[] = [5, 15, 25];
  isPrincipal: boolean;
  subs: any[] = [];

  constructor(
    private asmService: AssignmentService,
    private schoolService: SchoolService,
    private issueService: IssueService,
    private toastService: ToastService,
    private router: Router,
    private auth: AuthService,
    private activateRouter: ActivatedRoute,
    private documentService: DocumentService
  ) {}

  getStatusSeverity(statusId: any): string {
    const statusSeverityMap: { [key: number]: string } = {
      13: 'warning',
      14: 'danger',
      15: 'success',
    };
    return statusSeverityMap[statusId] || 'info'; // Default to ' info' if statusId is not in the map
  }

  loadDocuments() {
    const sub = this.documentService
      .filterTreeTask(
        this.pageNo,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
        this.assignmentName,
        this.selectedStatus,
        this.currentIssueSelected,
        this.selectedSchool
      )
      .subscribe({
        next: (data) => {
          this.taskTrees = data.taskTreeDtos.content;
          this.maxPage = data.taskTreeDtos.totalPages;
          this.totalElements = data.taskTreeDtos.totalElements;
          this.changePageSize();
          this.router.navigate([], {
            relativeTo: this.activateRouter,
            queryParams: {
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              sortBy: this.sortBy,
              sortDirection: this.sortDirection,
              assignmentName: this.assignmentName,
              currentIssueSelected: this.currentIssueSelected,
              advanceSearch: this.advanceSearch,
              status: this.selectedStatus,
              schoolId: this.selectedSchool,
            },
            queryParamsHandling: 'merge',
          });
        },
      });
    this.subs.push(sub);
  }

  onAdvanceSearch() {
    if (this.advanceSearch) {
      this.reset();
      this.advanceSearch = false;
      this.advanceSearchButtonText = 'Hiện tra cứu nâng cao';
    } else {
      this.reset();
      this.advanceSearch = true;
      this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao';
    }
  }

  protected reset() {
    this.pageNo = 1;
    this.sortBy = 'createdDate';
    this.sortDirection = 'desc';
    this.assignmentName = '';
    this.selectedSchool = null;
    this.selectedStatus = null;
    this.currentIssueSelected = null;
    this.loadDocuments();
  }

  ngOnInit(): void {
    for (const role of this.auth.getRoleFromJwt()) {
      if (role.authority === Role.PRINCIPAL) {
        this.isPrincipal = true;
        this.selectedSchool = this.auth.getSchoolFromJwt().schoolId;
      }
    }
    if (!this.isPrincipal) {
      const sub = this.schoolService.findAllSchools().subscribe({
        next: (data) => {
          this.schools = data;
        },
        error: (error) => {
          this.toastService.showError('error', 'Lỗi', error.error.message);
        },
      });
      this.subs.push(sub);
    }

    const sub = this.issueService.getIssueDropDownResponse().subscribe({
      next: (result) => {
        this.issueDropDowns = result.issueDropDownBoxDtos;
        this.initQuery();
        this.loadDocuments();
      },
      error: (error) => {
        this.toastService.showError('error', 'Lỗi', error.error.message);
      },
    });
    this.subs.push(sub);
  }

  onSort(sortBy: string) {
    if (this.sortBy === sortBy) {
      // If it is the same column, toggle the sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If it is a different column, set the new sortBy and sortDirection
      this.sortBy = sortBy;
      this.sortDirection = 'asc'; // or 'desc' depending on your default sorting preference
    }

    // Reload the guidance documents with the updated sorting
    this.loadDocuments();
  }

  initQuery() {
    const sub = this.activateRouter.queryParams.subscribe((value) => {
      if (value['pageNo']) {
        this.pageNo = value['pageNo'];
      }
      if (value['pageSize']) {
        this.pageSize = value['pageSize'];
      }
      if (value['sortBy']) {
        this.sortBy = value['sortBy'];
      }
      if (value['sortDirection']) {
        this.sortDirection = value['sortDirection'];
      }
      if (value['assignmentName']) {
        this.assignmentName = value['assignmentName'];
      }
      if (
        value['currentIssueSelected'] &&
        value['currentIssueSelected'] !== undefined
      ) {
        this.currentIssueSelected = Number(value['currentIssueSelected']);
      }

      if (value['schoolId'] && value['schoolId'] !== undefined) {
        this.selectedSchool = Number(value['schoolId']);
      }
      if (value['advanceSearch']) {
        this.advanceSearch = value['advanceSearch'] == 'true';
        if (this.advanceSearch) {
          this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao';
        } else {
          this.advanceSearchButtonText = 'Hiện tra cứu nâng cao';
        }
      }
      if (value['status'] && value['status'] !== undefined) {
        this.selectedStatus = Number(value['status']);
      }
    });
    this.subs.push(sub);
  }

  maxPageOnKeyUp() {
    if (this.pageNo > this.maxPage) {
      this.pageNo = this.maxPage;
      this.toastService.showWarn(
        'paging',
        'Thông báo',
        'Số trang bạn vừa tìm không thể vượt quá ' + this.maxPage
      );
    }
  }

  changePageSize() {
    if (
      this.taskTrees.length == 0 &&
      this.pageNo > 1 &&
      this.totalElements > 0
    ) {
      this.pageNo = this.maxPage;
      this.loadDocuments();
    }
  }

  onDetail(
    schoolId: number | undefined,
    issueId: number | undefined,
    statusId: number | undefined
  ) {
    {
      if (this.isPrincipal) {
        this.router.navigate(['assign-assignment/' + issueId]);
      } else {
        if (statusId != 15) {
          this.toastService.showError(
            'error',
            'Lỗi',
            'Hồ sơ của trường chưa hoàn thành\nVui lòng không thực hiện thao tác này'
          );
        } else {
          this.router.navigate(['list-assignment/detail-assignment'], {
            queryParams: { issueId: issueId, schoolId: schoolId },
          });
        }
      }
    }
  }

  onTableDataChange($event: number) {
    this.pageNo = $event;
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    unSub(this.subs);
  }
}
