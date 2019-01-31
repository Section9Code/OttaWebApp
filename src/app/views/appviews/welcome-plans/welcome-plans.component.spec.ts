import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePlansComponent } from './welcome-plans.component';

describe('WelcomePlansComponent', () => {
  let component: WelcomePlansComponent;
  let fixture: ComponentFixture<WelcomePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
