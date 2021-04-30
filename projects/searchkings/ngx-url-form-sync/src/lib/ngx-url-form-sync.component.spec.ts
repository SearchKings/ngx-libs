import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxUrlFormSyncComponent } from './ngx-url-form-sync.component';

describe('NgxUrlFormSyncComponent', () => {
  let component: NgxUrlFormSyncComponent;
  let fixture: ComponentFixture<NgxUrlFormSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxUrlFormSyncComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxUrlFormSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
