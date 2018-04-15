import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentItemMessagesComponent } from './content-item-messages.component';

describe('ContentItemMessagesComponent', () => {
  let component: ContentItemMessagesComponent;
  let fixture: ComponentFixture<ContentItemMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentItemMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentItemMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
