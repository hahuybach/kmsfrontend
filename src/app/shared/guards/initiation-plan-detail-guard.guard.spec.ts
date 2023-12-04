import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { initiationPlanDetailGuardGuard } from './initiation-plan-detail-guard.guard';

describe('initiationPlanDetailGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => initiationPlanDetailGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
