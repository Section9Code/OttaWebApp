import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEventsComponent } from './content-events.component';

describe('ContentEventsComponent', () => {
  let component: ContentEventsComponent;
  let fixture: ComponentFixture<ContentEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
