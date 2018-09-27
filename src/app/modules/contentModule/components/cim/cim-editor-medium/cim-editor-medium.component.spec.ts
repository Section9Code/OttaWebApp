import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CimEditorMediumComponent } from './cim-editor-medium.component';

describe('CimEditorMediumComponent', () => {
  let component: CimEditorMediumComponent;
  let fixture: ComponentFixture<CimEditorMediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CimEditorMediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CimEditorMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
