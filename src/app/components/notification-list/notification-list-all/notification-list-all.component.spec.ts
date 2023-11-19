import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationListAllComponent } from './notification-list-all.component';

describe('NotificationListAllComponent', () => {
  let component: NotificationListAllComponent;
  let fixture: ComponentFixture<NotificationListAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationListAllComponent]
    });
    fixture = TestBed.createComponent(NotificationListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
