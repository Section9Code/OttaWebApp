import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentProjectPersonsaCreateLayoutComponent } from './content-project-personsa-create-layout.component';

describe('ContentProjectPersonsaCreateLayoutComponent', () => {
  let component: ContentProjectPersonsaCreateLayoutComponent;
  let fixture: ComponentFixture<ContentProjectPersonsaCreateLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentProjectPersonsaCreateLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectPersonsaCreateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
