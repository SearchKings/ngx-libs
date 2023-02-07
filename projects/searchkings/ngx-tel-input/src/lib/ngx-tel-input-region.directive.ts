import { Directive, forwardRef, Optional } from '@angular/core';
import { NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

import { NgxTelInputService } from './ngx-tel-input.service';

@Directive({
  selector: '[skNgxTelInputRegion]',
  providers: [
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => NgxTelInputRegionDirective),
    //   multi: true,
    // },
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => NgxTelInputPhoneDirective),
    //   multi: true,
    // },
  ],
})
export class NgxTelInputRegionDirective {
  constructor(
    private telInputService: NgxTelInputService,
    @Optional() private ngControl: NgControl
  ) {
    if (!this.ngControl) {
      throw new Error('We need a control first dummy');
    }

    this.telInputService.setRegionControl(this.ngControl);
  }

  ngOnInit() {
    this.ngControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(this.ngControl.control.value))
      .subscribe((val) => this.telInputService.setRegion(val));
  }

  onChange: (optionValue: string | null) => any = () => {};

  onValidationChange: () => any = () => {};

  onTouched: () => any = () => {};

  writeValue(val: string) {
    console.log('writing region value', val);
    // this.telInputService.control.get('region').setValue(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: any): void {
    this.onValidationChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // isDisabled ? this.control.disable() : this.control.enable();
  }
}
