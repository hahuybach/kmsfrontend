import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationListUnseenComponent } from './notification-list-unseen.component';

describe('NotificationListUnseenComponent', () => {
  let component: NotificationListUnseenComponent;
  let fixture: ComponentFixture<NotificationListUnseenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationListUnseenComponent]
    });
    fixture = TestBed.createComponent(NotificationListUnseenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
