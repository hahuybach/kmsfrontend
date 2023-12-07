import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataNotExistComponent } from './data-not-exist.component';

describe('DataNotExistComponent', () => {
  let component: DataNotExistComponent;
  let fixture: ComponentFixture<DataNotExistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataNotExistComponent]
    });
    fixture = TestBed.createComponent(DataNotExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
