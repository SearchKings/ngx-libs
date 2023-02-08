import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private fb: FormBuilder) {}
  title = 'demo';
  telControl = this.fb.control<string>(null, {
    validators: Validators.required,
  });
}
