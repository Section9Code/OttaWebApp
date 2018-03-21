import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

const noop = () => {
};

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OttaColourPickerComponent),
  multi: true
};

const customValidationProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => OttaColourPickerComponent),
  multi: true,
};


@Component({
  selector: 'otta-colour-picker',
  templateUrl: './otta-colour-picker.component.html',
  styleUrls: ['./otta-colour-picker.component.css'],
  providers: [customValueProvider, customValidationProvider]
})
export class OttaColourPickerComponent implements ControlValueAccessor, Validator {

  // Holds the value of this control
  _value = '';

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private onValidatorChangeCallback: () => void = noop;

  // Get accessor
  get value(): any {
    return this._value;
  };

  changed() {
    this.onChangeCallback(this._value);
    this.onChangeCallback(this._value);
  }

  // Set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChangeCallback(v);
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this._value) {
      this._value = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChangeCallback = fn;
  }

  validate(c: AbstractControl): { [key: string]: any; } {
    return null;
  }

  valid(): boolean {
    if(!this._value || this._value === '') return false;
    else return true;
  }
}
