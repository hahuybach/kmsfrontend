import {Component, OnInit} from '@angular/core';
import {FilterGuidanceDocumentResponse} from "../../../models/filter-guidance-document-response";
import {GuidanceDocumentService} from "../../../services/guidance-document.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IssueDropDownResponse} from "../../../models/issue-drop-down-response";
import {IssueService} from "../../../services/issue.service";

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
  pageNo: number = 0;
  pageSize: number = 2;
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
  advanceSearchButtonText = 'Hiện tra cứu nâng cao'
  constructor(private guidanceDocumentService: GuidanceDocumentService,
              private route: Router,
              private issueService: IssueService
  ) {
  }

  loadGuidanceDocuments(): void {
    console.log("current page" + this.pageNo)

    if ((this.startDateTime != null && this.endDateTime != null) && (this.endDateTime < this.startDateTime)) {
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
          console.log(this.guidanceDocuments);
          console.log("size " + this.allGuidanceDocument);
        },
        error: (error) => {
          console.log("Error occurred while fetching guidance documents:", error);
        }
      });
    this.dateError = false;

  }

  ngOnInit(): void {
    this.issueService.getIssueDropDownResponse()
      .subscribe({
        next: (result) => {
          this.issueDropDowns = result.issueDropDownBoxDtos;
        }
      })
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
    if(this.advanceSearch){
      this.advanceSearch = false;
      this.advanceSearchButtonText = 'Hiện tra cứu nâng cao'
    }else {
      this.advanceSearch = true;
      this.advanceSearchButtonText = 'Ẩn tra cứu nâng cao'
    }

  }

  onTableDataChange($event: number) {
    console.log("event" + $event)
    this.pageNo = $event;
    this.loadGuidanceDocuments()
  }
}

