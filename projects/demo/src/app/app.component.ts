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
  // telControl = this.fb.control<string>('+14164517997');
  telControl = this.fb.control<string>(null);
}
