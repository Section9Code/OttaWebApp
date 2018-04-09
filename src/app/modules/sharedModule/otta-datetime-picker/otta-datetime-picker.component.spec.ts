import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OttaDatetimePickerComponent } from './otta-datetime-picker.component';

describe('OttaDatetimePickerComponent', () => {
  let component: OttaDatetimePickerComponent;
  let fixture: ComponentFixture<OttaDatetimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OttaDatetimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OttaDatetimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
