import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAuthComponent } from './mobile-auth.component';

describe('MobileAuthComponent', () => {
  let component: MobileAuthComponent;
  let fixture: ComponentFixture<MobileAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
