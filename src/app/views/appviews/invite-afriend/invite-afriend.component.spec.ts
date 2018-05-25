import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAfriendComponent } from './invite-afriend.component';

describe('InviteAfriendComponent', () => {
  let component: InviteAfriendComponent;
  let fixture: ComponentFixture<InviteAfriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteAfriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAfriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
