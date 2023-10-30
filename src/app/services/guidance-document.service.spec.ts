import { TestBed } from '@angular/core/testing';

import { GuidanceDocumentService } from './guidance-document.service';

describe('GuidanceDocumentService', () => {
  let service: GuidanceDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuidanceDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
