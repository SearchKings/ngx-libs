import { NgModule } from '@angular/core';

import { NgxTelInputPhoneDirective } from './ngx-tel-input-phone.directive';
import { NgxTelInputRegionDirective } from './ngx-tel-input-region.directive';
import { NgxTelInputComponent } from './ngx-tel-input.component';

@NgModule({
  declarations: [
    NgxTelInputPhoneDirective,
    NgxTelInputRegionDirective,
    NgxTelInputComponent,
  ],
  imports: [],
  exports: [
    NgxTelInputPhoneDirective,
    NgxTelInputRegionDirective,
    NgxTelInputComponent,
  ],
})
export class NgxTelInputModule {}
