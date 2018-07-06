import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ContentProjectIntegrationService } from 'services/ContentProjectIntegration.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-integration-oauth',
  templateUrl: './integration-oauth.component.html',
  styleUrls: ['./integration-oauth.component.css']
})
export class IntegrationOauthComponent implements OnInit {
  isWorking = true;
  message: string;

  constructor(
    private cookieSvc: CookieService,
    private activatedRoute: ActivatedRoute,
    private integrationService: ContentProjectIntegrationService) { }

  ngOnInit() {
    const state = this.cookieSvc.get('oAuthState');
    console.log('Completing integration', state);

    this.activatedRoute.queryParams.subscribe(response => {
      console.log('Params:', response);
      const code = response['code'];

      // If all the components are there complete oAuth callback
      if (state && code) {
        this.integrationService.completeCallback(state, code).subscribe(
          () => {
            this.message = null;
            this.isWorking = false;
            window.close();
          },
          error => {
            this.message = `Error completing the integration, please try again later. ${error}`;
          }
        );
      }
    });
  }

}
