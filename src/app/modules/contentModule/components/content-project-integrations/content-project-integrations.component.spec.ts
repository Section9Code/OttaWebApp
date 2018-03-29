import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentProjectIntegrationsComponent } from './content-project-integrations.component';

describe('ContentProjectIntegrationsComponent', () => {
  let component: ContentProjectIntegrationsComponent;
  let fixture: ComponentFixture<ContentProjectIntegrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentProjectIntegrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
