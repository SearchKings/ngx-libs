import { Injectable } from '@angular/core';
import {
  getSupportedRegionCodes,
  getSupportedCallingCodes,
} from 'awesome-phonenumber';
import { countries, Country } from 'countries-list';

export type CountryWithCode = Country & { code: string };

@Injectable({
  providedIn: 'root',
})
export class NgxTelInputService {
  /**
   * Get region codes (e.g. CA, US, UK), for each supported region
   * @returns A list of region codes (e.g. CA, US, UK), for each supported region
   */
  getRegionCodes(): string[] {
    return getSupportedRegionCodes();
  }

  /**
   * Get calling codes (e.g. +1, +44), for each supported region
   * @returns A list of calling codes (e.g. +1, +44), for each supported region
   */
  getCallingCodes(): string[] {
    return getSupportedCallingCodes();
  }

  /**
   * Retrieve an alphabetically-sorted list of countries with metadata for each
   * @returns A list of countries and their 2-letter ISO code
   */
  getCountries(): CountryWithCode[] {
    return this.getRegionCodes()
      .reduce((acc: CountryWithCode[], regionCode) => {
        if (countries[regionCode]) {
          acc.push({
            ...countries[regionCode],
            code: regionCode,
          });
        }

        return acc;
      }, [])
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
