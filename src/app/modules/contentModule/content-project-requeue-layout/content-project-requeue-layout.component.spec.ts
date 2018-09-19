import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentProjectRequeueLayoutComponent } from './content-project-requeue-layout.component';

describe('ContentProjectRequeueLayoutComponent', () => {
  let component: ContentProjectRequeueLayoutComponent;
  let fixture: ComponentFixture<ContentProjectRequeueLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentProjectRequeueLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectRequeueLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
