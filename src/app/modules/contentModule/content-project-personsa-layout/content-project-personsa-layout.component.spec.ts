import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentProjectPersonsaLayoutComponent } from './content-project-personsa-layout.component';

describe('ContentProjectPersonsaLayoutComponent', () => {
  let component: ContentProjectPersonsaLayoutComponent;
  let fixture: ComponentFixture<ContentProjectPersonsaLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentProjectPersonsaLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectPersonsaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
