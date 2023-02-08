import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { NgxTelInputService } from '../../../searchkings/ngx-tel-input/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private fb: FormBuilder, public telService: NgxTelInputService) {}
  title = 'demo';
  telControl = this.fb.control<string>(null, {
    validators: Validators.required,
  });
}
