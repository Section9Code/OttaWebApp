import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimEditorFacebookComponent } from './cim-editor-facebook.component';

describe('CimEditorFacebookComponent', () => {
  let component: CimEditorFacebookComponent;
  let fixture: ComponentFixture<CimEditorFacebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimEditorFacebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimEditorFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
