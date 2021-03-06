import { Component, OnInit } from '@angular/core';
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
    private activatedRoute: ActivatedRoute,
    private integrationService: ContentProjectIntegrationService) { }

  ngOnInit() {
    const state = localStorage.getItem('oAuthState');
    console.log('[INT] Completing integration', state);

    this.activatedRoute.queryParams.subscribe(response => {
      console.log('[INT] Params:', response);
      const code = response['code'];

      // If all the components are there complete oAuth callback
      if (state && code) {
        this.integrationService.completeCallback(state, code).subscribe(
          () => {
            console.log('[INT] Complete');
            this.message = null;
            this.isWorking = false;
            window.close();
          },
          error => {
            this.message = `Error completing the integration, please try again later. ${error}`;
            console.log('[INT] Error:', error);
          }
        );
      }
    });
  }

}
