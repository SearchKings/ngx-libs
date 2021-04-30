import { TestBed } from '@angular/core/testing';

import { NgxScrollTrackerService } from './ngx-scroll-tracker.service';

describe('NgxScrollTrackerService', () => {
  let service: NgxScrollTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxScrollTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
