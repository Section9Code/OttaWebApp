import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPersonaFormComponent } from './content-persona-form.component';

describe('ContentPersonaFormComponent', () => {
  let component: ContentPersonaFormComponent;
  let fixture: ComponentFixture<ContentPersonaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPersonaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPersonaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
