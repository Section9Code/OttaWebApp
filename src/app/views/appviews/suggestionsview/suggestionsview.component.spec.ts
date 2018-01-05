import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsviewComponent } from './suggestionsview.component';

describe('SuggestionsviewComponent', () => {
  let component: SuggestionsviewComponent;
  let fixture: ComponentFixture<SuggestionsviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestionsviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
