import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSearchLayoutComponent } from './content-search-layout.component';

describe('ContentSearchLayoutComponent', () => {
  let component: ContentSearchLayoutComponent;
  let fixture: ComponentFixture<ContentSearchLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSearchLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSearchLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
