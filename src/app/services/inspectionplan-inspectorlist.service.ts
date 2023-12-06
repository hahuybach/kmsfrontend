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
      popupInspectorList = popupInspectorList.filter(i => i !== inspector);
    });

    this.inspectorList.next(inspectorList);
    this.popupInspectorList.next(popupInspectorList);

    this.initialInspectorList = [...inspectorList];
    this.initialPopupInspectorList = [...popupInspectorList];
  }

  deleteFromInspectorList(inspector: any) {
    let inspectorList = this.inspectorList.getValue();
    let popupInspectorList = this.popupInspectorList.getValue();
    inspectorList = inspectorList.filter(i => i !== inspector);
    popupInspectorList.push(inspector);
    this.inspectorList.next(inspectorList);
    this.popupInspectorList.next(popupInspectorList);
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
    this.inspectorListIsValid.next(isValid);
  }

  clearBothList() {
    this.inspectorList.next([]);
    this.popupInspectorList.next([])
  }
}
