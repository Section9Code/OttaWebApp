import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportCreateTicketLayoutComponent } from './support-create-ticket-layout.component';

describe('SupportCreateTicketLayoutComponent', () => {
  let component: SupportCreateTicketLayoutComponent;
  let fixture: ComponentFixture<SupportCreateTicketLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportCreateTicketLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportCreateTicketLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
