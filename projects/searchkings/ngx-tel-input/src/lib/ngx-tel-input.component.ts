import {
  Component,
  ContentChild,
  forwardRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  OnDestroy,
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
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';

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
export class NgxTelInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() placeholderFormat: Exclude<
    keyof ParsedPhoneNumber['number'],
    'input'
  > = 'national';
  @Input() displayFormat: Exclude<keyof ParsedPhoneNumber['number'], 'input'> =
    'national';
  @Input() valueFormat: Exclude<keyof ParsedPhoneNumber['number'], 'input'> =
    'e164';
  @Input() defaultRegion: string;
  @Output() parsed: EventEmitter<ParsedPhoneNumber> =
    new EventEmitter<ParsedPhoneNumber>();
  @ContentChild('controls') controlsTemplate: TemplateRef<any>;
  public displayForm = this.fb.group({
    region: this.fb.control<string>(null),
    phone: this.fb.control<string>(null),
  });
  public placeholder: string = '';
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.defaultRegion) {
      this.displayForm.controls.region.setValue(this.defaultRegion);
    }

    this.displayForm.valueChanges
      .pipe(
        tap(() => this.onTouched()),
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
        tap((parsed) => this.parsed.emit(parsed)),
        takeUntil(this.destroyed$)
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

        this.displayForm.controls.phone.setErrors(null);
        this.onChange(valueFormat);
      } else {
        this.displayForm.controls.phone.setErrors({
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
    isDisabled ? this.displayForm.disable() : this.displayForm.enable();
  }

  validate(): ValidationErrors {
    return this.displayForm.controls.phone.errors;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
