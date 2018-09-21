import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimListComponent } from './cim-list.component';

describe('CimListComponent', () => {
  let component: CimListComponent;
  let fixture: ComponentFixture<CimListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
