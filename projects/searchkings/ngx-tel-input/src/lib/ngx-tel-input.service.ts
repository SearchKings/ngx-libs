import { Injectable } from '@angular/core';
import {
  ParsedPhoneNumber,
  parsePhoneNumber,
  getSupportedRegionCodes,
  getSupportedCallingCodes,
} from 'awesome-phonenumber';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NgxTelInputService {
  private region$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private phone$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() {
    combineLatest([this.phone$, this.region$]).subscribe(([phone, region]) =>
      this.parseNumber(phone, region)
    );
  }

  getRegionCodes(): string[] {
    return getSupportedRegionCodes();
  }

  getCallingCodes(): string[] {
    return getSupportedCallingCodes();
  }

  setRegion(region: string): void {
    this.region$.next(region);
  }

  setPhone(phone: string): void {
    this.phone$.next(phone);
  }

  parseNumber(val: string, regionCode: string): ParsedPhoneNumber {
    let pn: ParsedPhoneNumber = parsePhoneNumber(val);

    if (!pn.valid) {
      pn = parsePhoneNumber(val, { regionCode });
    }

    return pn;
  }
}
