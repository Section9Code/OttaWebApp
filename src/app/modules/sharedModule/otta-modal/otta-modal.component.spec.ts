import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OttaModalComponent } from './otta-modal.component';

describe('OttaModalComponent', () => {
  let component: OttaModalComponent;
  let fixture: ComponentFixture<OttaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OttaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OttaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
