import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NgxTelInputService } from './ngx-tel-input.service';

@Component({
  selector: 'sk-ngx-tel-input',
  templateUrl: './ngx-tel-input.component.html',
  styleUrls: ['./ngx-tel-input.component.css'],
  providers: [NgxTelInputService],
})
export class NgxTelInputComponent implements OnInit {
  @ContentChild('controls') controlsTemplate: TemplateRef<any>;

  public displayForm = this.fb.group({
    region: this.fb.control(null),
    phone: this.fb.control(null),
  });

  constructor(
    private fb: FormBuilder,
    private telService: NgxTelInputService
  ) {}

  ngOnInit(): void {
    this.displayForm.valueChanges.subscribe(({ phone, region }) => {
      const parsed = this.telService.parseNumber(phone, region);

      if (parsed.valid) {
        this.displayForm.patchValue(
          {
            region: parsed.regionCode,
            phone: parsed.number.national,
          },
          {
            emitEvent: false,
          }
        );
      }
    });
  }
}
