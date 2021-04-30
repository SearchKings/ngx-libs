import { TestBed } from '@angular/core/testing';

import { UrlFormSyncService } from './url-form-sync.service';

describe('UrlFormSyncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UrlFormSyncService = TestBed.inject(UrlFormSyncService);
    expect(service).toBeTruthy();
  });
});
