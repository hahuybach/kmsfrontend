import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InspectionplanInspectorlistService {
  private inspectorList = new BehaviorSubject<any[]>([]);
  private popupInspectorList = new BehaviorSubject<any[]>([]);
  private inspectorListIsValid = new BehaviorSubject<boolean>(false);

  private initialInspectorList: any[] = [];
  private initialPopupInspectorList: any[] = [];

  inspectorList$ = this.inspectorList.asObservable();
  inspectorListIsValid$ = this.inspectorListIsValid.asObservable();
  popupInspectorList$ = this.popupInspectorList.asObservable();

  setInspectorList(list: any[]) {
    this.inspectorList.next(list);
    this.initialInspectorList = [...list];
  }

  setPopupInspectorList(list: any[]) {
    this.popupInspectorList.next(list);
    this.initialPopupInspectorList = [...list];
  }

  saveToInspectorList(selectedInspectors: any[]) {
    let inspectorList = this.inspectorList.getValue();
    let popupInspectorList = this.popupInspectorList.getValue();

    selectedInspectors.forEach(inspector => {
      inspectorList.push(inspector);
    });

    this.inspectorList.next(inspectorList);
    this.popupInspectorList.next(popupInspectorList.filter(i => !selectedInspectors.includes(i)));

    this.initialInspectorList = [...inspectorList];
    this.initialPopupInspectorList = [...popupInspectorList.filter(i => !selectedInspectors.includes(i))];
  }


  deleteFromInspectorList(inspector: any) {
    let inspectorList = this.inspectorList.getValue();
    let popupInspectorList = this.popupInspectorList.getValue();

    const updatedPopupList = JSON.parse(JSON.stringify(popupInspectorList));

    updatedPopupList.push(inspector);

    this.inspectorList.next(inspectorList.filter(i => i !== inspector));
    this.popupInspectorList.next(updatedPopupList);
  }

  resetBothLists() {
    this.inspectorList.next(this.initialInspectorList);
    this.popupInspectorList.next(this.initialPopupInspectorList)
  }

  saveChanges() {
    this.initialInspectorList = [...this.inspectorList.getValue()];
    this.initialPopupInspectorList = [...this.popupInspectorList.getValue()];
    return this.initialInspectorList;
  }

  setInspectorListIsValid(isValid: boolean) {
    console.log(isValid)
    this.inspectorListIsValid.next(isValid);
  }

  clearBothList() {
    this.inspectorList.next([]);
    this.popupInspectorList.next([])
  }
}
