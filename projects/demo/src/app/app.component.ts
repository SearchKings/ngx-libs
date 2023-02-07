import { Component } from '@angular/core';

import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private fb: FormBuilder) {}
  title = 'demo';
  telForm = this.fb.group({
    region: this.fb.control(null),
    phone: this.fb.control('+14164517997'),
  });
}
