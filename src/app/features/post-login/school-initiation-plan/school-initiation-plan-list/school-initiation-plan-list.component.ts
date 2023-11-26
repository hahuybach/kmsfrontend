import {Component, OnInit} from '@angular/core';
import {InitiationplanService} from 'src/app/services/initiationplan.service';
import {IssueDropDownResponse} from "../../../../models/issue-drop-down-response";
import {SchoolResponse} from "../../../../models/school-response";
import {SchoolService} from "../../../../services/school.service";
import {IssueService} from "../../../../services/issue.service";
import {ToastService} from "../../../../shared/toast/toast.service";
import {InitiationPlanResponse} from "../../../../models/initiation-plan-response";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {Role} from "../../../../shared/enum/role";

@Component({
    selector: 'app-school-initiation-plan-list',
    templateUrl: './school-initiation-plan-list.component.html',
    styleUrls: ['./school-initiation-plan-list.component.scss'],
})
export class SchoolInitiationPlanListComponent implements OnInit {
    schoolInitPlans: InitiationPlanResponse[];
    advanceSearch: boolean = false;
    planName: string;
    issueDropDowns: IssueDropDownResponse[];
    currentIssueSelected: any;
    creationStartDateTime: any;
    creationEndDateTime: any;
    creationDateError: boolean = false;
    deadlineStartDateTime: any;
    deadlineEndDateTime: any;
    deadlineDateError: any;

    advanceSearchButtonText = "Hiện tra cứu nâng cao";
    schools: SchoolResponse[];
    selectedSchool: any
    statuses = [
        {label: 'Đang thực thi', value: 6},
        {label: 'Chờ phê duyệt', value: 7},
        {label: 'Phê duyệt', value: 8},
        {label: 'Không được phê duyệt', value: 9},
    ];
    selectedStatus: any;
    pageNo: number = 1;
    pageSize: number = 5;
    sortBy: string = 'createdDate';
    sortDirection: string = 'desc';
    totalElements: number;
    maxPage: any;
    recordPerPageOption: number[] = [5, 15, 25];
    isPrincipal: boolean

    constructor(private initiationplanService: InitiationplanService,
                private schoolService: SchoolService,
                private issueService: IssueService,
                private toastService: ToastService,
                private router: Router,
                private auth: AuthService,
                private activateRouter: ActivatedRoute,
                ) {
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
          if(value['planName']){
            this.planName = value['planName'];
          }
          if(value['currentIssueSelected'] && value['currentIssueSelected'] !== undefined){
            this.currentIssueSelected.issueId = value['currentIssueSelected'];
          }
          if(value['creationStartDateTime']){
            this.creationStartDateTime = value['creationStartDateTime'];
          }
          if(value['creationEndDateTime']){
            this.creationEndDateTime = value['creationEndDateTime']
          }
          if(value['deadlineStartDateTime']){
            this.deadlineStartDateTime = value['deadlineStartDateTime']
          }
          if(value['deadlineEndDateTime']){
            this.deadlineEndDateTime = value['deadlineEndDateTime']
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
        }
      )
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

    loadDocuments() {
        if ((this.creationStartDateTime != null && this.creationEndDateTime != null) && (new Date(this.creationStartDateTime) > new Date(this.creationEndDateTime))) {
            this.creationDateError = true;
            return
        }
        if ((this.deadlineStartDateTime != null && this.deadlineEndDateTime != null) && (new Date(this.deadlineStartDateTime) > new Date(this.deadlineEndDateTime))) {
            this.deadlineDateError = true;
            return
        }
        this.initiationplanService.filterInitiationPlan(this.pageNo, this.pageSize, this.sortBy,
            this.sortDirection, this.planName, this.selectedStatus, this.currentIssueSelected, this.selectedSchool,
            this.creationStartDateTime, this.creationEndDateTime, this.deadlineStartDateTime, this.deadlineEndDateTime)
            .subscribe({
                next: (data) => {
                    this.schoolInitPlans = data.initiationPlanDtoPage.content;
                    this.maxPage = data.initiationPlanDtoPage.totalPages;
                    this.totalElements = data.initiationPlanDtoPage.totalElements;
                    console.log(data);
                    this.changePageSize();
                  this.router.navigate([], {
                    relativeTo: this.activateRouter,
                    queryParams: {
                      pageNo: this.pageNo,
                      pageSize: this.pageSize,
                      sortBy: this.sortBy,
                      sortDirection: this.sortDirection,
                      planName: this.planName,
                      currentIssueSelected: this.currentIssueSelected?.issueId,
                      creationStartDateTime: this.creationStartDateTime,
                      creationEndDateTime: this.creationEndDateTime,
                      deadlineStartDateTime: this.deadlineStartDateTime,
                      deadlineEndDateTime: this.deadlineEndDateTime,
                      advanceSearch: this.advanceSearch,
                      selectedSchool: this.selectedSchool?.schoolId,
                      // Add other query parameters as needed
                    },
                    queryParamsHandling: 'merge'
                  });
                }
            })
        this.creationDateError = false
        this.deadlineDateError = false
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
        this.planName = '';
        this.selectedSchool = null;
        this.selectedStatus = null;
        this.currentIssueSelected = null;
        this.creationStartDateTime = null;
        this.creationEndDateTime = null;
        this.deadlineStartDateTime = null;
        this.deadlineEndDateTime = null;
        this.loadDocuments();
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

    onDetail(id: any) {
      if (this.isPrincipal){
        this.router.navigate(['initiationplan/' + id])
      }else {
        this.router.navigate(['schoolinitiationplan/' + id])
      }
    }

    maxPageOnKeyUp() {
        if (this.pageNo > this.maxPage) {
            this.pageNo = this.maxPage;
            this.toastService.showWarn('paging', "Thông báo", 'Số trang bạn vừa tìm không thể vượt quá ' + this.maxPage)
        }
    }

    changePageSize() {
        if (this.schoolInitPlans.length == 0 && this.pageNo > 1 && this.totalElements > 0) {
            this.pageNo = this.maxPage;
            this.loadDocuments();
        }
    }

    onTableDataChange($event: number) {
        this.pageNo = $event;
        this.loadDocuments()
    }
}
