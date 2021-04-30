import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxScrollTrackerComponent } from './ngx-scroll-tracker.component';

describe('NgxScrollTrackerComponent', () => {
  let component: NgxScrollTrackerComponent;
  let fixture: ComponentFixture<NgxScrollTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxScrollTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxScrollTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
