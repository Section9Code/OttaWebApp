import { Component, forwardRef, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

// This control wraps the Bootstrap 2 Datepicker
// http://eonasdan.github.io/bootstrap-datetimepicker/

// <otta-datetime-picker name="dpDeadline" [(ngModel)]="displayDeadLineDate" ></otta-datetime-picker>

declare var $: any;

const noop = () => { };

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OttaDatetimePickerComponent),
  multi: true
};

const customValidationProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => OttaDatetimePickerComponent),
  multi: true,
};

@Component({
  selector: 'otta-datetime-picker',
  templateUrl: './otta-datetime-picker.component.html',
  styleUrls: ['./otta-datetime-picker.component.css'],
  providers: [customValueProvider, customValidationProvider]
})
export class OttaDatetimePickerComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterViewInit {
  // VARIABLES -----------------------------
  @Input() name: string;
  @Input() minDate: moment.Moment = moment('2015-01-01');



  // Holds the value of this control
  _value: moment.Moment;

  constructor() { }

  // CONTROL FUNCTIONS ---------------------
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    // Initialise the control using the bootstrap 3 datetime picker
    const id = `#${this.name}`;
    $(id).datetimepicker({
      format: 'Do MMMM YYYY, h:mm a',
      minDate: this.minDate
    });

    // Update the control when something changes
    $(id).on('dp.change', e => {
      this.value = e.date;
    });
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private onValidatorChangeCallback: () => void = noop;

  // Get accessor
  get value(): any {
    return this._value;
  };

  // Set accessor including call the onchange callback
  set value(v: any) {
    if (v == null) { return; }

    // If a string value is passed into the datapicker convert it to a moment object
    if (typeof (v) === 'string') {
      // Convert v to moment
      v = moment(v);
    }

    // Make sure the value being passed in is a moment object
    let newValue: moment.Moment = v;
    if (!newValue) {
      return;
    }

    // Set the value if the current value is undefined OR is has a new date
    if (!this._value || newValue.toISOString() !== this._value.toISOString()) {
      this._value = newValue;
      this.onChangeCallback(newValue);

      // Update the picker
      // HACK
      // Sometimes the picker isn't available on the page, if it's not there loop around a few times before giving up.
      // This can happen when the DOM is changing something or the control is becoming visible (in a modal window for example)
      // This code gives the DOM a chance to render the element before trying again. As a safe guard it will only try a 
      // few times before giving up.
      let tryCount = 0;
      let retryTimer = setTimeout(() => {
        // Update the picker
        const id = `#${this.name}`;
        if ($(id).data('DateTimePicker')) {
          $(id).data('DateTimePicker').date(newValue);
          clearTimeout(retryTimer);
        }

        if (++tryCount >= 5) {
          clearTimeout(retryTimer);
        }
      }, 300);


    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    this.value = value;
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
    if (!this._value) return false;
    else return true;
  }

}
