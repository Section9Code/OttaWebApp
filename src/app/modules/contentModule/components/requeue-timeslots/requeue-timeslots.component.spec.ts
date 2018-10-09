import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequeueTimeslotsComponent } from './requeue-timeslots.component';

describe('RequeueTimeslotsComponent', () => {
  let component: RequeueTimeslotsComponent;
  let fixture: ComponentFixture<RequeueTimeslotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequeueTimeslotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequeueTimeslotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
