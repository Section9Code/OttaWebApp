import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationOauthComponent } from './integration-oauth.component';

describe('IntegrationOauthComponent', () => {
  let component: IntegrationOauthComponent;
  let fixture: ComponentFixture<IntegrationOauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationOauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
