import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentItemMessageTwitterPreviewComponent } from './content-item-message-twitter-preview.component';

describe('ContentItemMessageTwitterPreviewComponent', () => {
  let component: ContentItemMessageTwitterPreviewComponent;
  let fixture: ComponentFixture<ContentItemMessageTwitterPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentItemMessageTwitterPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentItemMessageTwitterPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
