import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentProjectRequeueDetailsLayoutComponent } from './content-project-requeue-details-layout.component';

describe('ContentProjectRequeueDetailsLayoutComponent', () => {
  let component: ContentProjectRequeueDetailsLayoutComponent;
  let fixture: ComponentFixture<ContentProjectRequeueDetailsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentProjectRequeueDetailsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectRequeueDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
