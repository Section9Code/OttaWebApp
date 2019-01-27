import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { Router } from '@angular/router';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup-page.html'
})
export class SignupPageComponent implements OnInit {
  version: string = environment.version;

  constructor(public auth: AuthService, public router: Router, public mixpanel: MixpanelService) { }

  ngOnInit(): void {
    this.mixpanel.Track(MixpanelEvent.Login);
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
}
