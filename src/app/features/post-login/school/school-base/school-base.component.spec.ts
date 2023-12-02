import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolBaseComponent } from './school-base.component';

describe('SchoolBaseComponent', () => {
  let component: SchoolBaseComponent;
  let fixture: ComponentFixture<SchoolBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolBaseComponent]
    });
    fixture = TestBed.createComponent(SchoolBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
