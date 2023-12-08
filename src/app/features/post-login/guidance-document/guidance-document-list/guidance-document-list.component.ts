import {Component, OnDestroy, OnInit} from '@angular/core';
import {FilterGuidanceDocumentResponse} from "../../../../models/filter-guidance-document-response";
import {GuidanceDocumentService} from "../../../../services/guidance-document.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IssueDropDownResponse} from "../../../../models/issue-drop-down-response";
import {IssueService} from "../../../../services/issue.service";
import {MessageService} from "primeng/api";
import {AuthService} from "../../../../services/auth.service";
import {Role} from "../../../../shared/enum/role";
import {tuiDayToDate, unSub} from "../../../../shared/util/util";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-guidance-document-list',
  templateUrl: './guidance-document-list.component.html',
  styleUrls: ['./guidance-document-list.component.scss']
})
export class GuidanceDocumentListComponent implements OnInit, OnDestroy {
  guidanceDocuments: FilterGuidanceDocumentResponse[];
  issueDropDowns: IssueDropDownResponse[];
  currentIssueSelected: IssueDropDownResponse;
  allGuidanceDocument: number = 0;
  pageNo: number = 1;
  pageSize: number = 5;
  sortBy: string = 'createdDate';
  sortDirection: string = 'desc';
  description: string = '';
  guidanceDocumentName: string = '';
  startDateTime: any;
  endDateTime: any;
  fullName: string = '';
  dateError = false;
  globalSearch: string = '';
  advanceSearch: boolean = false;
  advanceSearchButtonText = 'Hiện tra cứu nâng cao';
  maxPage: number = 0;
  maxPageError: boolean = false;
    recordPerPageOption: number[] = [5, 15, 25];

  issueId: number = -1
  isPrincipal: boolean = false;
  isDirector: boolean = false;
  isAdmin: boolean = false;
  isInspector: boolean = false;
  isChiefInspector: boolean = false;
  isViceDirector: boolean = false;
  isSchoolNormalEmp: boolean = false;
  isSpecialist: boolean = false;
  schoolRoles: any[] = [Role.VICE_PRINCIPAL, Role.CHIEF_TEACHER, Role.CHIEF_OFFICE, Role.TEACHER,
    Role.ACCOUNTANT, Role.MEDIC, Role.CLERICAL_ASSISTANT, Role.SECURITY];
  sub: any[] = []
  createDateRange: any;
  setAuth() {
    if (this.auth.getRolesFromCookie()) {
      for (const argument of this.auth.getRoleFromJwt()) {
        if (argument.authority === Role.DIRECTOR) {
          this.isDirector = true;
        }
        if (argument.authority === Role.PRINCIPAL) {
          this.isPrincipal = true;
        }
        if (argument.authority === Role.ADMIN) {
          this.isAdmin = true;
        }
        if (argument.authority === Role.VICE_DIRECTOR) {
          this.isViceDirector = true;
        }
        if (argument.authority === Role.INSPECTOR) {
          this.isInspector = true;
        }
        if (argument.authority === Role.CHIEF_INSPECTOR) {
          this.isChiefInspector = true;
        }
        if (argument.authority === Role.SPECIALIST) {
          this.isSpecialist = true;
        }
        if (this.schoolRoles.some(value => value === argument.authority)) {
          this.isSchoolNormalEmp = true;
        }

      }

    }
  }
  constructor(private guidanceDocumentService: GuidanceDocumentService,
              private route: Router,
              private issueService: IssueService,
              private messageService: MessageService,
              private activateRouter: ActivatedRoute,
              private auth: AuthService,
              private datePipe: DatePipe
  ) {
    this.guidanceDocuments = [];
  }


  loadGuidanceDocuments(): void {
    if ((this.startDateTime != null && this.endDateTime != null) && (new Date(this.startDateTime) > new Date(this.endDateTime))) {
      this.dateError = true;
      return
    }
   const sub =  this.guidanceDocumentService
      .filterGuidanceDocuments(
        this.pageNo,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
        this.guidanceDocumentName,
        this.description,
        this.startDateTime,
        this.endDateTime,
        this.fullName, this.currentIssueSelected ?
          this.currentIssueSelected.issueId : '',
        this.globalSearch
      )
      .subscribe({
        next: (result) => {
          this.guidanceDocuments = result.guidanceDocumentDtos;
          this.allGuidanceDocument = result.size;
          this.maxPage = result.maxPage;
            this.onChangePageSize();
          console.log("error " + this.startDateTime);
          this.startDateTime = new Date(this.startDateTime)
          this.route.navigate([], {
            relativeTo: this.activateRouter,
            queryParams: {
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              sortBy: this.sortBy,
              sortDirection: this.sortDirection,
              guidanceDocumentName: this.guidanceDocumentName,
              startDateTime: (this.startDateTime as Date).toISOString() ,
              endDateTime: (this.endDateTime as Date).toISOString(),
              fullName: this.fullName,
              globalSearch     :this.globalSearch,
                advanceSearch: this.advanceSearch

              // Add other query parameters as needed
            },
            queryParamsHandling: 'merge'
          });

        },
        error: (error) => {
          console.log("Error occurred while fetching guidance documents:", error);
        }
      });
    this.dateError = false;
    this.sub.push(sub);
    console.log(this.startDateTime);
  }

  loadIssueIdForCreate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.issueService.getCurrentActiveIssue().subscribe({
        next: (result) => {
          this.issueId = result.issueDto.issueId;
          resolve(true);
        },
        error: (error) => {
          this.showError(error.error.message);
          resolve(false);
        }
      });
    });
  }

  ngOnInit(): void {
this.setAuth()
    this.issueService.getIssueDropDownResponse()
      .subscribe({
        next: (result) => {
          this.issueDropDowns = result.issueDropDownBoxDtos;
        }
      })

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
          if(value['guidanceDocumentName']){
            this.guidanceDocumentName = value['guidanceDocumentName'];
          }
          if(value['startDateTime']){
            this.startDateTime = new Date(value['startDateTime']) ;
          }
          if(value['endDateTime']){
            this.endDateTime = new Date(value['endDateTime']) ;
          }
          if(value['fullName']){
            this.fullName = value['fullName']
          }
          if(value['globalSearch']){
            this.globalSearch = value['globalSearch']
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
    this.loadGuidanceDocuments();


  }

  onDetail(id?: any) {
    this.route.navigate(['guidance-document/' + id])
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
    this.loadGuidanceDocuments();
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

  onTableDataChange($event: number) {
    this.pageNo = $event;
    this.loadGuidanceDocuments()
  }

  protected reset() {
    this.pageNo = 1;
    this.sortBy = 'createdDate';
    this.sortDirection = 'desc';
    this.description = ''
    this.guidanceDocumentName = '';
    this.startDateTime = '';
    this.endDateTime = '';
    this.startDateTime = '';
    this.globalSearch = '';
    this.fullName = '';
    this.createDateRange = null;
    this.loadGuidanceDocuments();
  }


  maxPageOnKeyUp() {
    if (this.pageNo > this.maxPage) {
      this.maxPageError = true;
      this.pageNo = this.maxPage;
      this.showWarn();
    } else {
      this.maxPageError = false;
    }
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: 'Số trang bạn vừa tìm không thể vượt quá ' + this.maxPage,
      key: 'paging'
    });
  }

  showError(errorMsg: string) {
    console.log("error pop up")
    this.messageService.add({
      severity: 'error', summary: 'Error', detail: errorMsg,
      key: 'issueId'

    });
  }

  onCreateGuidanceDocument() {
    this.loadIssueIdForCreate().then((success) => {
      if (success) {
        this.route.navigate(['guidance-document/create/' + this.issueId])
      }
    })
  }

  onChangePageSize(){
      if(this.guidanceDocuments.length == 0 && this.pageNo > 1){
      this.pageNo = this.maxPage;
      this.loadGuidanceDocuments();
    }
  }

    changePageSize() {
        this.loadGuidanceDocuments();
    }

  ngOnDestroy(): void {
    unSub(this.sub)
  }

  changeStartDate() {
    if (this.createDateRange){
      this.startDateTime = tuiDayToDate(this.createDateRange.from);
      this.endDateTime = tuiDayToDate(this.createDateRange.to);
      this.loadGuidanceDocuments();
    }
  }
}

