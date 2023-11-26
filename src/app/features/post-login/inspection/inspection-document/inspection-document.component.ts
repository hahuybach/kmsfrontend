import {Component, OnInit} from '@angular/core';
import {InspectionDocument} from "../../../../models/inspection";
import {InspectionService} from "../../../../services/inspection.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-inspection-document',
  templateUrl: './inspection-document.component.html',
  styleUrls: ['./inspection-document.component.scss']
})
export class InspectionDocumentComponent implements OnInit {
  inspectionId: number;
  recordId: number;
  inspectionDocument: InspectionDocument;
  createRecordPopupVisible: boolean = false;
  updateRecordPopupVisible: boolean = false;
  detailRecordPopupVisible: boolean = false;

  constructor(
    private readonly inspectionService: InspectionService,
    private readonly route: ActivatedRoute,
  ) {
  }

  changeCreateRecordVisible() {
    this.createRecordPopupVisible = !this.createRecordPopupVisible;
  }
  changeUpdateRecordVisible() {
    this.updateRecordPopupVisible = !this.updateRecordPopupVisible;
  }

  initUpdateRecordData(recordId: number){
    this.recordId = recordId;
    this.changeUpdateRecordVisible()
  }

  changeDetailRecordVisible() {
    this.detailRecordPopupVisible = !this.detailRecordPopupVisible;
  }

  initDetailRecordData(recordId: number){
    this.recordId = recordId;
    this.changeDetailRecordVisible()
  }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(parentParams => {
      this.inspectionId = parentParams['id'];
    })
    this.inspectionService.getInspectionDocument(this.inspectionId).subscribe({
      next: (data) => {
        this.inspectionDocument = data;
        console.log(this.inspectionDocument);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}