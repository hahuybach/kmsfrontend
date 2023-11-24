import {Component, OnInit} from '@angular/core';
import {TaskTreeResponse} from "../../../../models/task-tree-response";
import {IssueDropDownResponse} from "../../../../models/issue-drop-down-response";
import {SchoolResponse} from "../../../../models/school-response";
import {InitiationplanService} from "../../../../services/initiationplan.service";
import {SchoolService} from "../../../../services/school.service";
import {IssueService} from "../../../../services/issue.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {AssignmentService} from "../../../../services/assignment.service";
import {Role} from "../../../../shared/enum/role";
import {DocumentService} from "../../../../services/document.service";

@Component({
  selector: 'app-assignment-tree-list',
  templateUrl: './assignment-tree-list.component.html',
  styleUrls: ['./assignment-tree-list.component.scss']
})
export class AssignmentTreeListComponent implements OnInit{
    taskTrees: TaskTreeResponse[];
  assignmentName: string
  advanceSearch: boolean = false;
  issueDropDowns: IssueDropDownResponse[];
  currentIssueSelected: any;
  advanceSearchButtonText = "Hiện tra cứu nâng cao";
  schools: SchoolResponse[];
  selectedSchool: any
  statuses = [
    {label: 'Chưa bắt đầu', value: 13},
    {label: 'Chưa hoàn thành', value: 14},
    {label: 'Hoàn thành', value: 15},
  ];
  selectedStatus: any;
  pageNo: number = 1;
  pageSize: number = 5;
  sortBy: string = 'School.schoolName';
  sortDirection: string = 'desc';
  totalElements: number;
  maxPage: any;
  recordPerPageOption: number[] = [5, 15, 25];
  isPrincipal: boolean

  constructor(private asmService: AssignmentService,
              private schoolService: SchoolService,
              private issueService: IssueService,
              private toastService: ToastService,
              private router: Router,
              private auth: AuthService,
              private activateRouter: ActivatedRoute,
              private documentService: DocumentService
  ) {
  }

  loadDocuments() {
    this.documentService.filterTreeTask(this.pageNo,this.pageSize,this.sortBy,this.sortDirection,
        this.assignmentName,this.selectedStatus, this.currentIssueSelected,
        this.selectedSchool).subscribe({
        next: (data) =>{
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
                    currentIssueSelected: this.currentIssueSelected?.issueId,
                    advanceSearch: this.advanceSearch,
                    selectedSchool: this.selectedSchool?.schoolId,
                    status: this.selectedStatus
                },
                queryParamsHandling: 'merge'
            });

        }
    })
  }

  onAdvanceSearch() {
    if (this.advanceSearch) {
      this.reset();
      this.advanceSearch = false;
      this.advanceSearchButtonText = 'Hiện tra cứu nâng cao'
    } else {
      this.reset();
      this.advanceSearch = true;
      this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao'
    }
  }

  private reset() {
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
      if (role.authority === Role.PRINCIPAL){
        this.isPrincipal = true;
        this.selectedSchool = this.auth.getSchoolFromJwt();
      }
    }
    if (!this.isPrincipal){
      this.schoolService.findAllSchools().subscribe({
        next: (data) => {
          this.schools = data
        },
        error: (error) => {
          this.toastService.showError("error", "Lỗi", error.error.message)
        }
      })
    }


    this.issueService.getIssueDropDownResponse()
      .subscribe({
        next: (result) => {
          this.issueDropDowns = result.issueDropDownBoxDtos;
          this.currentIssueSelected = this.issueDropDowns.at(0);
          this.initQuery()
          this.loadDocuments();

        },
        error: (error) => {
          this.toastService.showError("error", "Lỗi", error.error.message)
        }
      })
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

  initQuery(){
    this.activateRouter.queryParams.subscribe(

      value => {
        if(value['pageNo']){
          this.pageNo = value['pageNo'];
        }
        if(value['pageSize']){
          this.pageSize = value['pageSize'];
        }
        if(value['sortBy']){
          this.sortBy = value['sortBy'];
        }
        if(value['sortDirection']){
          this.sortDirection = value['sortDirection'];
        }
        if(value['assignmentName']){
          this.assignmentName = value['assignmentName'];
        }
        if(value['currentIssueSelected'] && value['currentIssueSelected'] !== undefined){
          this.currentIssueSelected.issueId = value['currentIssueSelected'];
        }

        if(value['selectedSchool'] && value['selectedSchool'] !== undefined ){
          this.selectedSchool.schoolId = value['selectedSchool']
        }
        if(value['advanceSearch']){
          this.advanceSearch = (value['advanceSearch'] == 'true' )
          if (this.advanceSearch){
            this.advanceSearchButtonText = "Ẩn tra cứu nâng cao"
          }else {
            this.advanceSearchButtonText = "Hiện tra cứu nâng cao"

          }
        }
        if (value['status']){
            this.selectedStatus.value = value['status']
        }
      }
    )
  }
    maxPageOnKeyUp() {
        if (this.pageNo > this.maxPage) {
            this.pageNo = this.maxPage;
            this.toastService.showWarn('paging', "Thông báo", 'Số trang bạn vừa tìm không thể vượt quá ' + this.maxPage)
        }
    }

    changePageSize() {
        if (this.taskTrees.length == 0 && this.pageNo > 1 && this.totalElements > 0) {
            this.pageNo = this.maxPage;
            this.loadDocuments();
        }
    }

    onDetail(rootAssignmentId: number | undefined) {

    }

    onTableDataChange($event: number) {
        this.pageNo = $event;
        this.loadDocuments()
    }
}
