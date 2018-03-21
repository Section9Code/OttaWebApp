import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OttaColourPickerComponent } from './otta-colour-picker.component';

describe('OttaColourPickerComponent', () => {
  let component: OttaColourPickerComponent;
  let fixture: ComponentFixture<OttaColourPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OttaColourPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OttaColourPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
