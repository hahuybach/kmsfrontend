import {Component, OnInit} from '@angular/core';
import {FilterGuidanceDocumentResponse} from "../../../../models/filter-guidance-document-response";
import {GuidanceDocumentService} from "../../../../services/guidance-document.service";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs";

@Component({
    selector: 'app-guidance-document-detail',
    templateUrl: './guidance-document-detail.component.html',
    styleUrls: ['./guidance-document-detail.component.scss']
})
export class GuidanceDocumentDetailComponent implements OnInit {
    guidanceDocumentId: number;
    guidanceDocument: FilterGuidanceDocumentResponse;

    constructor(private guidanceDocumentService: GuidanceDocumentService
        , private route: ActivatedRoute,) {
    }

    ngOnInit(): void {
        this.route.params
            .pipe(
                switchMap((params) => {
                    this.guidanceDocumentId = +params['id'];
                    return this.guidanceDocumentService.getGuidanceDocumentById(this.guidanceDocumentId);
                })
            )
            .subscribe((data) => {
                this.guidanceDocument = data.guidanceDocument;
                console.log(this.guidanceDocument);
            });
    }


    protected readonly document = document;
}
