import { Injectable } from '@angular/core';
import {
  ParsedPhoneNumber,
  parsePhoneNumber,
  getSupportedRegionCodes,
  getSupportedCallingCodes,
} from 'awesome-phonenumber';

@Injectable({
  providedIn: 'root',
})
export class NgxTelInputService {
  getRegionCodes(): string[] {
    return getSupportedRegionCodes();
  }

  getCallingCodes(): string[] {
    return getSupportedCallingCodes();
  }

  parseNumber(val: string, regionCode: string): ParsedPhoneNumber {
    let pn: ParsedPhoneNumber = parsePhoneNumber(val);

    if (!pn.valid) {
      pn = parsePhoneNumber(val, { regionCode });
    }

    return pn;
  }
}
