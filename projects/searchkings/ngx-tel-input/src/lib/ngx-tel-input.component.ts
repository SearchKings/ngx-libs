import { Component } from '@angular/core';

import { NgxTelInputService } from './ngx-tel-input.service';

@Component({
  selector: 'sk-ngx-tel-input',
  templateUrl: './ngx-tel-input.component.html',
  styleUrls: ['./ngx-tel-input.component.css'],
  providers: [NgxTelInputService],
})
export class NgxTelInputComponent {}
