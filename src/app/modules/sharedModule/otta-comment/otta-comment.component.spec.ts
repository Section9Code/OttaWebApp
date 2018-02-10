import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OttaCommentComponent } from './otta-comment.component';

describe('OttaCommentComponent', () => {
  let component: OttaCommentComponent;
  let fixture: ComponentFixture<OttaCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OttaCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OttaCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
