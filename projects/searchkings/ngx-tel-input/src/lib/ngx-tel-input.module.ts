import { NgModule } from '@angular/core';

import { NgxTelInputPhoneDirective } from './ngx-tel-input-phone.directive';
import { NgxTelInputRegionDirective } from './ngx-tel-input-region.directive';

@NgModule({
  declarations: [NgxTelInputPhoneDirective, NgxTelInputRegionDirective],
  imports: [],
  exports: [NgxTelInputPhoneDirective, NgxTelInputRegionDirective],
})
export class NgxTelInputModule {}
