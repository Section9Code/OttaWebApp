import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup-page.html'
})
export class SignupPageComponent implements OnInit, OnDestroy {
  version: string = environment.version;
  signUpWithOption = false;

  subQuery: Subscription;

  constructor(
    public auth: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public mixpanel: MixpanelService
  ) { }

  ngOnInit(): void {
    this.mixpanel.Track(MixpanelEvent.Signup);
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    localStorage.removeItem('welcomeOption');
    this.subQuery = this.route.queryParams.subscribe(params => {
      const opt = params['opt'];
      if (opt) {
        this.mixpanel.Track(MixpanelEvent.Signup_with_option, opt);
        localStorage.setItem('welcomeOption', opt);
        this.signUpWithOption = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.subQuery) { this.subQuery.unsubscribe(); }
  }
}
