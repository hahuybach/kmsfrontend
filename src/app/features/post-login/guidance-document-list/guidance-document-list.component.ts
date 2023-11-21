import {Component, OnInit} from '@angular/core';
import {FilterGuidanceDocumentResponse} from "../../../models/filter-guidance-document-response";
import {GuidanceDocumentService} from "../../../services/guidance-document.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IssueDropDownResponse} from "../../../models/issue-drop-down-response";
import {IssueService} from "../../../services/issue.service";
import {MessageService} from "primeng/api";
import {ToastModule} from 'primeng/toast';
import {resolve} from "@angular/compiler-cli";
import {switchMap} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {Role} from "../../../shared/enum/role";

@Component({
  selector: 'app-guidance-document-list',
  templateUrl: './guidance-document-list.component.html',
  styleUrls: ['./guidance-document-list.component.scss']
})
export class GuidanceDocumentListComponent implements OnInit {
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
  startDateTime: string;
  endDateTime: string;
  fullName: string = '';
  dateError = false;
  globalSearch: string = '';
  advanceSearch: boolean = false;
  advanceSearchButtonText = 'Hiện tra cứu nâng cao';
  maxPage: number = 0;
  maxPageError: boolean = false;
    recordPerPageOption: number[] = [5, 15, 25];

  issueId: number = -1
  isPrincipal = false;

  constructor(private guidanceDocumentService: GuidanceDocumentService,
              private route: Router,
              private issueService: IssueService,
              private messageService: MessageService,
              private activateRouter: ActivatedRoute,
              private auth: AuthService
  ) {
    this.guidanceDocuments = [];
  }

  loadGuidanceDocuments(): void {
    if ((this.startDateTime != null && this.endDateTime != null) && (new Date(this.startDateTime) > new Date(this.endDateTime))) {
      this.dateError = true;
      return
    }
    this.guidanceDocumentService
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

          this.route.navigate([], {
            relativeTo: this.activateRouter,
            queryParams: {
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              sortBy: this.sortBy,
              sortDirection: this.sortDirection,
              guidanceDocumentName: this.guidanceDocumentName,
              startDateTime: this.startDateTime,
              endDateTime: this.endDateTime,
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
    for (const role of this.auth.getRoleFromJwt()) {
      if (role.authority === Role.PRINCIPAL){
        this.isPrincipal = true;
      }
    }
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
            this.startDateTime = value['startDateTime'];
          }
          if(value['endDateTime']){
            this.endDateTime = value['endDateTime'];
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
    this.route.navigate(['guidanceDocument/' + id])
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

  reset() {
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
        this.route.navigate(['guidanceDocument/create/' + this.issueId])
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
}

