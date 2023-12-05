import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InspectorService} from "../../../../../services/inspector.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {CellClickedEvent, ColDef, GridOptions, GridReadyEvent, SortChangedEvent} from "ag-grid-community";
import { Observable } from 'rxjs';
import {AgGridAngular} from "ag-grid-angular";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-issue-list-pop-up',
  templateUrl: './issue-list-pop-up.component.html',
  styleUrls: ['./issue-list-pop-up.component.scss']
})
export class IssueListPopUpComponent{
  @Input() popupInspectorVisible:boolean;
  @Output() popupInspectorVisibleChange = new EventEmitter<boolean>();
  inspectorList:any= [];
  selectedInspectors: any = [];
  resetInspectorListVisible(){
    this.popupInspectorVisibleChange.emit(this.popupInspectorVisible);
  }
  addInspector(){}

  // constructor(
  //   private readonly inspectorService: InspectorService
  // ) {
  // }
  //
  // ngOnInit(): void {
  //     this.inspectorService.getInspectors().subscribe({
  //       next: (data:object[]) => {
  //         this.inspectorList = data;
  //       },
  //       error: (error):any =>{
  //         console.log(error);
  //       }
  //       }
  //     )
  // }

  gridOptions: GridOptions = {
    columnDefs: [
      { field: 'make'},
      { field: 'model'},
      { field: 'price' }
    ],
    pagination: true,

  }


  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private http: HttpClient) {}

  // Example load data from server
  onGridReady(params: GridReadyEvent) {
    this.rowData$ = this.http
      .get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
  }

  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }
}
