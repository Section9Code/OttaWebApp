import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimEditorPinterestComponent } from './cim-editor-pinterest.component';

describe('CimEditorPinterestComponent', () => {
  let component: CimEditorPinterestComponent;
  let fixture: ComponentFixture<CimEditorPinterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimEditorPinterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimEditorPinterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
