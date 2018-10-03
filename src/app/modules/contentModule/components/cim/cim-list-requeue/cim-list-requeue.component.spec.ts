import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimListRequeueComponent } from './cim-list-requeue.component';

describe('CimListRequeueComponent', () => {
  let component: CimListRequeueComponent;
  let fixture: ComponentFixture<CimListRequeueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimListRequeueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimListRequeueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
