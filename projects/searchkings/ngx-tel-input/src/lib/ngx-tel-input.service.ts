import { Injectable } from '@angular/core';
import {
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
}
