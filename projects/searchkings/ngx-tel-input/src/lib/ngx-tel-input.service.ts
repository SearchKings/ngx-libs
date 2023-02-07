import { Injectable } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import {
  ParsedPhoneNumber,
  parsePhoneNumber,
  getSupportedRegionCodes,
  getSupportedCallingCodes,
} from 'awesome-phonenumber';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NgxTelInputService {
  private regionControl: NgControl;
  private phoneControl: NgControl;
  private region$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private phone$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() {
    combineLatest([this.phone$, this.region$])
      .pipe(filter(() => !!this.phoneControl && !!this.regionControl))
      .subscribe(([phone, region]) => this.parseNumber(phone, region));
  }

  getRegionCodes(): string[] {
    return getSupportedRegionCodes();
  }

  getCallingCodes(): string[] {
    return getSupportedCallingCodes();
  }

  setPhoneControl(control: NgControl) {
    console.log('setting phone contro', control);
    this.phoneControl = control;
  }

  setRegionControl(control: NgControl) {
    console.log('setting region contro', control);
    this.regionControl = control;
  }

  setRegion(region: string): void {
    this.region$.next(region);
  }

  setPhone(region: string): void {
    this.phone$.next(region);
  }

  parseNumber(val: string, regionCode: string) {
    console.log('parsing', val, regionCode);
    let pn = parsePhoneNumber(val);

    if (!pn.valid) {
      pn = parsePhoneNumber(val, { regionCode });
    }

    if (pn.valid) {
      const regionCode = pn.regionCode;
      const e164 = pn.number.e164;

      console.log('parsed!', regionCode, e164);
      this.phoneControl.control.setValue(e164);
      this.regionControl.control.setValue(regionCode);
    } else {
      this.phoneControl.control?.setErrors({
        invalidPhone: true,
      });
      this.regionControl.control?.setErrors({
        invalidPhone: true,
      });
    }
  }
}
