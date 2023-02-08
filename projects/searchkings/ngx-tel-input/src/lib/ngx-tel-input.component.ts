import {
  Component,
  ContentChild,
  forwardRef,
  OnInit,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { NgxTelInputService } from './ngx-tel-input.service';

@Component({
  selector: 'sk-ngx-tel-input',
  templateUrl: './ngx-tel-input.component.html',
  styleUrls: ['./ngx-tel-input.component.css'],
  providers: [
    NgxTelInputService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxTelInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: NgxTelInputComponent,
      multi: true,
    },
  ],
})
export class NgxTelInputComponent implements OnInit, ControlValueAccessor {
  @ContentChild('controls') controlsTemplate: TemplateRef<any>;

  private valueControl = this.fb.control<string>(null);
  public displayForm = this.fb.group({
    region: this.fb.control<string>('CA'),
    phone: this.fb.control<string>(null),
  });

  constructor(
    private fb: FormBuilder,
    private telService: NgxTelInputService
  ) {}

  ngOnInit(): void {
    this.displayForm.valueChanges
      .pipe(
        startWith(this.displayForm.value),
        map(({ phone, region }) => this.telService.parseNumber(phone, region)),
        distinctUntilChanged(
          (parsedA, parsedB) => parsedA?.number?.e164 === parsedB?.number?.e164
        )
      )
      .subscribe((parsed) => {
        if (parsed.valid) {
          this.displayForm.patchValue(
            {
              region: parsed.regionCode,
              phone: parsed.number.national,
            },
            {
              emitEvent: false,
            }
          );

          this.valueControl.setValue(parsed.number.e164);
          this.valueControl.setErrors(null);
          this.onChange(parsed.number.e164);
        } else {
          this.valueControl.setValue(null);
          this.valueControl.setErrors({
            phoneInvalid: true,
          });
          this.onChange(null);
        }
      });
  }

  onChange: (val: string | null) => any = () => {};
  onTouched: () => any = () => {};
  writeValue(val: string) {
    this.displayForm.controls.phone.setValue(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.displayForm.disable() : this.displayForm.enable();
  }

  validate(): ValidationErrors {
    return this.valueControl.errors;
  }
}
