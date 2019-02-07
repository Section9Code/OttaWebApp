import { Component, ViewContainerRef } from '@angular/core';
import { AuthService } from "services/auth.service";
import { ToastsManager } from 'ng2-toastr';
import { UserDataService } from 'services/user-data.service';
import { Router, NavigationEnd } from '@angular/router';
import { AnalyticsService } from 'services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthService, private toast: ToastsManager, private vcr: ViewContainerRef, private router: Router, private analytics: AnalyticsService) {
    this.auth.handleAuthentication();
    this.toast.setRootViewContainerRef(vcr);

    // // Track users routes
    // this.router.events.subscribe(event => {
    //   if(event instanceof NavigationEnd) {
    //     this.analytics.TrackPageVisit(event.urlAfterRedirects);
    //   }
    // });
  }

}
