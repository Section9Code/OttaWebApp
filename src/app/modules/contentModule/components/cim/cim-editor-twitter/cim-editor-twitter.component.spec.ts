import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimEditorTwitterComponent } from './cim-editor-twitter.component';

describe('CimEditorTwitterComponent', () => {
  let component: CimEditorTwitterComponent;
  let fixture: ComponentFixture<CimEditorTwitterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimEditorTwitterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimEditorTwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
