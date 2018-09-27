import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimMessagesListComponent } from './cim-messages-list.component';

describe('CimMessagesListComponent', () => {
  let component: CimMessagesListComponent;
  let fixture: ComponentFixture<CimMessagesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimMessagesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimMessagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
