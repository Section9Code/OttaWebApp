import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMainLayoutComponent } from './support-main-layout.component';

describe('SupportMainLayoutComponent', () => {
  let component: SupportMainLayoutComponent;
  let fixture: ComponentFixture<SupportMainLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportMainLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
