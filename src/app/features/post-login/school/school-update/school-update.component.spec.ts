import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolUpdateComponent } from './school-update.component';

describe('SchoolUpdateComponent', () => {
  let component: SchoolUpdateComponent;
  let fixture: ComponentFixture<SchoolUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolUpdateComponent]
    });
    fixture = TestBed.createComponent(SchoolUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
