import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBaseComponent } from './login-base.component';

describe('LoginBaseComponent', () => {
  let component: LoginBaseComponent;
  let fixture: ComponentFixture<LoginBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginBaseComponent]
    });
    fixture = TestBed.createComponent(LoginBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
