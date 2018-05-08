import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentItemFilesComponent } from './content-item-files.component';

describe('ContentItemFilesComponent', () => {
  let component: ContentItemFilesComponent;
  let fixture: ComponentFixture<ContentItemFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentItemFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentItemFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
