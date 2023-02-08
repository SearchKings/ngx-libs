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
import {
  getExample,
  ParsedPhoneNumber,
  parsePhoneNumber,
} from 'awesome-phonenumber';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'sk-ngx-tel-input',
  templateUrl: './ngx-tel-input.component.html',
  styleUrls: ['./ngx-tel-input.component.css'],
  providers: [
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
  public placeholder: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.displayForm.valueChanges
      .pipe(
        startWith(this.displayForm.value),
        tap(({ region }) => this.updatePlaceholder(region)),
        map(({ phone, region }) => this.parseNumber(phone, region)),
        distinctUntilChanged(
          (parsedA, parsedB) =>
            parsedA?.number?.e164 &&
            parsedB?.number?.e164 &&
            parsedA.number.e164 === parsedB.number.e164
        )
      )
      .subscribe((parsed) => this.handleParsed(parsed));
  }

  parseNumber(val: string, regionCode: string): ParsedPhoneNumber {
    let pn: ParsedPhoneNumber = parsePhoneNumber(val);

    if (!pn.valid) {
      pn = parsePhoneNumber(val, { regionCode });
    }

    return pn;
  }

  handleParsed({ number, valid, regionCode }: ParsedPhoneNumber) {
    {
      const { national, e164, input } = number || {};

      if (valid) {
        this.displayForm.patchValue(
          {
            region: regionCode,
            phone: national,
          },
          {
            emitEvent: false,
          }
        );

        this.valueControl.setValue(e164);
        this.valueControl.setErrors(null);
        this.onChange(e164);
      } else {
        this.valueControl.setValue(input);
        this.valueControl.setErrors({
          phoneInvalid: true,
        });
        this.onChange(input);
      }
    }
  }

  updatePlaceholder(region: string) {
    if (region) {
      const { number } = getExample(region, 'mobile') || {};
      this.placeholder = number?.national || '';
    } else {
      this.placeholder = '';
    }
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
    if (isDisabled) {
      this.displayForm.disable();
      this.valueControl.disable();
    } else {
      this.displayForm.enable();
      this.valueControl.enable();
    }
  }

  validate(): ValidationErrors {
    return this.valueControl.errors;
  }
}
