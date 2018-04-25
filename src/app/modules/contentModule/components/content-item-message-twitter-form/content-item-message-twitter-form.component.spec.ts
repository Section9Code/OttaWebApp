import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentItemMessageTwitterFormComponent } from './content-item-message-twitter-form.component';

describe('ContentItemMessageTwitterFormComponent', () => {
  let component: ContentItemMessageTwitterFormComponent;
  let fixture: ComponentFixture<ContentItemMessageTwitterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentItemMessageTwitterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentItemMessageTwitterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
