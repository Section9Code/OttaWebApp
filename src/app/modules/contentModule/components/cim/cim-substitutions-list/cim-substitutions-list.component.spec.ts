import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimSubstitutionsListComponent } from './cim-substitutions-list.component';

describe('CimSubstitutionsListComponent', () => {
  let component: CimSubstitutionsListComponent;
  let fixture: ComponentFixture<CimSubstitutionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimSubstitutionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimSubstitutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
