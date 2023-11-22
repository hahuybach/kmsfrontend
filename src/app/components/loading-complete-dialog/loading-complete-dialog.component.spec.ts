import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingCompleteDialogComponent } from './loading-complete-dialog.component';

describe('LoadingCompleteDialogComponent', () => {
  let component: LoadingCompleteDialogComponent;
  let fixture: ComponentFixture<LoadingCompleteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingCompleteDialogComponent]
    });
    fixture = TestBed.createComponent(LoadingCompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
