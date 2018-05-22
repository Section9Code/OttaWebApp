import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportIndexLayoutComponent } from './support-index-layout.component';

describe('SupportIndexLayoutComponent', () => {
  let component: SupportIndexLayoutComponent;
  let fixture: ComponentFixture<SupportIndexLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportIndexLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportIndexLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
