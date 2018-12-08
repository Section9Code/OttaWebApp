import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentProjectPersonsaEditLayoutComponent } from './content-project-personsa-edit-layout.component';

describe('ContentProjectPersonsaEditLayoutComponent', () => {
  let component: ContentProjectPersonsaEditLayoutComponent;
  let fixture: ComponentFixture<ContentProjectPersonsaEditLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentProjectPersonsaEditLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectPersonsaEditLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
