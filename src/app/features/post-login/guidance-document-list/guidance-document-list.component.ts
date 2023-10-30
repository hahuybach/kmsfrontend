import {Component, OnInit} from '@angular/core';
import {FilterGuidanceDocumentResponse} from "../../../models/filter-guidance-document-response";
import {GuidanceDocumentService} from "../../../services/guidance-document.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-guidance-document-list',
  templateUrl: './guidance-document-list.component.html',
  styleUrls: ['./guidance-document-list.component.scss']
})
export class GuidanceDocumentListComponent implements OnInit {
  guidanceDocuments: FilterGuidanceDocumentResponse[];

  constructor(private guidanceDocumentService: GuidanceDocumentService,
              private route : Router
  ) {
  }

  ngOnInit(): void {
    this.guidanceDocumentService
      .filterGuidanceDocuments()
      .subscribe({
        next: (result) => {
          this.guidanceDocuments = result.guidanceDocumentDtos;
          console.log(this.guidanceDocuments);
          console.log(result);

        }
      })
  }

  onDetail(id: number) {
    this.route.navigate(['guidanceDocument/' + id])
  }
}

