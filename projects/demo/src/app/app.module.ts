import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxTelInputModule } from '@searchkings/ngx-tel-input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgxTelInputModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
