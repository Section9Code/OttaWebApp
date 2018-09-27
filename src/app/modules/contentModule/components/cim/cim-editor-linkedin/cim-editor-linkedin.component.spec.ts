import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimEditorLinkedinComponent } from './cim-editor-linkedin.component';

describe('CimEditorLinkedinComponent', () => {
  let component: CimEditorLinkedinComponent;
  let fixture: ComponentFixture<CimEditorLinkedinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimEditorLinkedinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimEditorLinkedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
