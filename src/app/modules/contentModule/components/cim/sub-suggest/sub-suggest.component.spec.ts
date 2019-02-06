import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSuggestComponent } from './sub-suggest.component';

describe('SubSuggestComponent', () => {
  let component: SubSuggestComponent;
  let fixture: ComponentFixture<SubSuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSuggestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
