import {
  Component,
  ContentChild,
  forwardRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
  @Input() placeholderFormat: Exclude<
    keyof ParsedPhoneNumber['number'],
    'input'
  > = 'national';
  @Input() displayFormat: Exclude<keyof ParsedPhoneNumber['number'], 'input'> =
    'national';
  @Input() valueFormat: Exclude<keyof ParsedPhoneNumber['number'], 'input'> =
    'e164';
  @Output() parsed: EventEmitter<ParsedPhoneNumber> =
    new EventEmitter<ParsedPhoneNumber>();
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
            parsedA?.number?.[this.valueFormat] &&
            parsedB?.number?.[this.valueFormat] &&
            parsedA.number?.[this.valueFormat] ===
              parsedB.number?.[this.valueFormat]
        ),
        tap((parsed) => this.parsed.emit(parsed))
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
      const {
        [this.displayFormat]: displayFormat,
        input,
        [this.valueFormat]: valueFormat,
      } = number || {};

      if (valid) {
        this.displayForm.patchValue(
          {
            region: regionCode,
            phone: displayFormat,
          },
          {
            emitEvent: false,
          }
        );

        this.valueControl.setValue(valueFormat);
        this.valueControl.setErrors(null);
        this.onChange(valueFormat);
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
      this.placeholder = number?.[this.placeholderFormat] || '';
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
