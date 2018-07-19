import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentItemMessageFacebookFormComponent } from './content-item-message-facebook-form.component';

describe('ContentItemMessageFacebookFormComponent', () => {
  let component: ContentItemMessageFacebookFormComponent;
  let fixture: ComponentFixture<ContentItemMessageFacebookFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentItemMessageFacebookFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentItemMessageFacebookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
