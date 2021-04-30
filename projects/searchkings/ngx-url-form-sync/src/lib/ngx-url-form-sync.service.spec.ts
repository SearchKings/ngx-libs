import { TestBed } from '@angular/core/testing';

import { NgxUrlFormSyncService } from './ngx-url-form-sync.service';

describe('NgxUrlFormSyncService', () => {
  let service: NgxUrlFormSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxUrlFormSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
