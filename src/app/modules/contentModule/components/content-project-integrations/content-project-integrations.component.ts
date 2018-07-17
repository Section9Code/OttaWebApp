import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ContentProjectIntegrationService, ProjectIntegrationModel, WordpressProjectIntegrationModel, IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ContentProjectModel } from 'services/content-project.service';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';
import { CookieService } from 'angular2-cookie/services/cookies.service';

declare var $: any;

// <content-project-integrations [project]=""></content-project-integrations>
@Component({
  selector: 'content-project-integrations',
  templateUrl: './content-project-integrations.component.html',
  styleUrls: ['./content-project-integrations.component.css']
})
export class ContentProjectIntegrationsComponent implements OnInit, OnDestroy {
  // Inputs
  @Input() project: ContentProjectModel = null;

  // Variables
  isLoadingIntegration = false;
  isCreating = false;
  isConnectingToTwitter = false;
  isConnectingToFacebook = false;
  isConnectingToLinkedIn = false;

  twitterOAuthFormUrl = '';
  facebookOAuthFromUrl = '';
  linkedInOAuthFromUrl = '';

  // Integrations with other systems
  integrations: ProjectIntegrationModel[] = [];
  wordpressIntegrations: ProjectIntegrationModel[] = [];
  mediumIntegrations: ProjectIntegrationModel[] = [];
  twitterIntegrations: ProjectIntegrationModel[] = [];
  facebookIntegrations: ProjectIntegrationModel[] = [];
  linkedInIntegrations: ProjectIntegrationModel[] = [];

  // Forms
  wordpressForm: WordpressProjectIntegrationModel = new WordpressProjectIntegrationModel();

  constructor(
    private sharedService: ContentProjectShareService,
    private integrationService: ContentProjectIntegrationService,
    private toast: ToastsManager,
    private tracking: MixpanelService,
    private alertSvc: SweetAlertService,
    private cookieSvc: CookieService
  ) { }

  ngOnInit(): void {

    // Load the current project integrations from the project share service
    this.isLoadingIntegration = true;
    this.sharedService.integrations.subscribe(
      response => {
        // Loaded integrations
        console.log('Integrations loaded', response);
        this.integrations = response;
        this.sortIntegration();
        this.isLoadingIntegration = false;
      },
      error => {
        // Unable to load integrations
        console.log('Error loading project integrations', error);
        this.toast.error('Unable to load project integrations', 'Error');
        this.tracking.TrackError(`Error loading integrations for project ${this.project.id}`, error);
        this.isLoadingIntegration = false;
      }
    );
  }

  ngOnDestroy(): void {
  }

  // Sorts the supplied integrations into their types so the UI can easily access them
  sortIntegration() {
    this.wordpressIntegrations = this.integrations.filter(i => i.IntegrationType === IntegrationTypes.Wordpress);
    this.mediumIntegrations = this.integrations.filter(i => i.IntegrationType === IntegrationTypes.Medium);
    this.twitterIntegrations = this.integrations.filter(i => i.IntegrationType === IntegrationTypes.Twitter);
    this.facebookIntegrations = this.integrations.filter(i => i.IntegrationType === IntegrationTypes.Facebook);
    this.linkedInIntegrations = this.integrations.filter(i => i.IntegrationType === IntegrationTypes.LinkedIn);
  }

  // Methods
  showWordpressForm() {
    this.wordpressForm = new WordpressProjectIntegrationModel();
    $('#wordpressModal').modal('show');
  }

  // Show the user the form they can use to authenticate their facebook account
  showFacebookForm() {
    this.isConnectingToFacebook = true;
    this.integrationService.facebookGetLogin(this.project.id).toPromise()
      .then(response => {
        // Set the Facebook OAuth Cookies
        this.cookieSvc.put('oAuthState', response.state);
        this.facebookOAuthFromUrl = response.url;
        const myWindow = window.open(this.facebookOAuthFromUrl, 'facebookAuth', 'width=1000,height=800');

        // Wait for the integration to be complete
        this.waitForIntegration(IntegrationTypes.Facebook).then(integration => {
          console.log('Integrated', integration);
          this.isConnectingToFacebook = false;
          this.toast.success('Project integrated with Facebook');
          this.facebookOAuthFromUrl = '';
          this.sharedService.addIntegration(integration);
        })
          .catch(error => {
            console.log('Error waiting for facebook integration to complete');
            this.isConnectingToFacebook = false;
            this.facebookOAuthFromUrl = '';
            this.toast.warning('Unable to connect to facebook. Please type again');
          });
      })
      .catch(error => {
        console.log('Error getting facebook login url', error);
        this.isConnectingToFacebook = false;
        this.toast.error('Unable to connect to facebook');
        this.tracking.TrackError('Error getting facebook OAuth login url', error);
      });
  }

  showLinkedInForm() {
    this.isConnectingToLinkedIn = true;
    this.integrationService.linkedInGetLogin(this.project.id).toPromise()
      .then(response => {
        this.cookieSvc.put('oAuthState', response.state);
        this.linkedInOAuthFromUrl = response.url;
        const myWindow = window.open(this.linkedInOAuthFromUrl, 'facebookAuth', 'width=1000,height=800');

        // Wait for the integration to be complete
        this.waitForIntegration(IntegrationTypes.LinkedIn).then(integration => {
          console.log('Integrated', integration);
          this.isConnectingToLinkedIn = false;
          this.toast.success('Project integrated with LinkedIn');
          this.facebookOAuthFromUrl = '';
          this.sharedService.addIntegration(integration);
        })
          .catch(error => {
            console.log('Error waiting for LinkedIn integration to complete');
            this.isConnectingToLinkedIn = false;
            this.facebookOAuthFromUrl = '';
            this.toast.warning('Unable to connect to LinkedIn. Please type again');
          });
      })
      .catch(error => {
        console.log('Error getting LinkedIn login url', error);
        this.isConnectingToLinkedIn = false;
        this.toast.error('Unable to connect to LinkedIn');
        this.tracking.TrackError('Error getting LinkedIn OAuth login url', error);
      });
  }

  // Refresh a facebook integration with the latest settings from the user
  refreshFacebook(integrationId: string) {
    this.integrationService.facebookRefresh(this.project.id, integrationId).toPromise()
      .then(response => {
        this.sharedService.removeIntegration(response.id);
        this.sharedService.addIntegration(response);
        this.toast.success('Facebook settings refreshed');
      })
      .catch(error => {
        console.log('Unable to refresh your Facebook settings');
        this.toast.warning('Unable to refresh facebook settings. Please type again');
      });
  }

  // Show the user the form they can use to authenticate their twitter account
  showTwitterForm() {
    this.isConnectingToTwitter = true;
    this.integrationService.twitterGetLogin(this.project.id).toPromise()
      .then(response => {
        console.log('Got twitter oAuth link', response);

        // Send the user to the twitter authentication page
        this.twitterOAuthFormUrl = response;
        const myWindow = window.open(this.twitterOAuthFormUrl, 'twitterAuth', 'width=500,height=550');

        // Wait for the user to accept the integration
        this.waitForIntegration(IntegrationTypes.Twitter).then(integration => {
          this.twitterOAuthFormUrl = '';
          this.sharedService.addIntegration(integration);
          this.isConnectingToTwitter = false;
          this.toast.success('Twitter is now connected to your project', 'Twitter connected');
        }).catch(error => {
          this.isConnectingToTwitter = false;
          this.twitterOAuthFormUrl = '';
          this.toast.error('Unable to connect your project with twitter, please try again', 'Unable to connect');
        });


      })
      .catch(error => {
        console.log('Error while trying to get login', error);
        this.toast.error('Unable to connect to twitter at the moment');
        this.tracking.TrackError('Error opening oAuth link to twitter', error);
        this.isConnectingToTwitter = false;
      });
  }

  addWordpressIntegration() {
    console.log('Add wordpress integration');

    // Add the wordpress integration
    this.isCreating = true;
    this.integrationService.addWordpressIntegration(this.project.id, this.wordpressForm).toPromise()
      .then(response => {
        console.log('Integration added', response);
        this.sharedService.addIntegration(response);
        this.toast.success('We were able to successfully connect to your site, integration added', 'Integration added');
        $('#wordpressModal').modal('hide');
        this.isCreating = false;
      })
      .catch(error => {
        console.log('Error while trying to add wordpress integration');
        this.tracking.TrackError(`Error while adding wordpress integration to project ${this.project.id}`);
        // tslint:disable-next-line:max-line-length
        this.toast.error('Unable to add wordpress integration. Please check the website address is correct and the username and password are for an editor user', 'Unable to connect');
        this.isCreating = false;
      });
  }

  // Remove an integration from the project
  removeIntegration(integrationId: string) {
    this.alertSvc.swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this integration?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      this.integrationService.removeIntegration(this.project.id, integrationId).toPromise()
        .then(response => {
          console.log('Integration removed')
          this.sharedService.removeIntegration(integrationId);
          this.toast.success('Integration removed');
        })
        .catch(error => {
          console.log('Error removing integration', error);
          this.toast.error('Unable to removed integration', 'Error');
          this.tracking.TrackError(`Error removing integration for project ${this.project.id}`, error);
        });
    },
      error => {
        // Error
        console.log('Alert dismissed');
      },
      () => {
        // Complete
      }
    );
  }

  // Loop around 20 times checking for an integration of a specific type.
  // Calls the promise when it finds the matching type or throws the error
  // if not found after the limit is reached.
  waitForIntegration(type: IntegrationTypes): Promise<ProjectIntegrationModel> {
    return new Promise((resolve, reject) => {
      console.log('Waiting for integration', type);
      let loopCount = 0;
      const timer = setInterval(() => {
        console.log('Checking for integration', loopCount);

        // Check for the integration
        this.integrationService.getAll(this.project.id).toPromise()
          .then(allIntegrations => {
            console.log('Checking integrations', allIntegrations);
            let integration = allIntegrations.filter(i => i.IntegrationType === type);
            if (integration.length >= 0 && integration[0] && integration[0] !== undefined) {
              console.log('Found integration', integration);
              clearInterval(timer);
              resolve(integration[0]);
            }
          })
          .catch(() => { });

        if (++loopCount >= 20) {
          // Reached the max number of checks
          console.log('Max number of checks reached', type);
          clearInterval(timer);
          reject(new Error('Integration not found'));
        }
      }, 2000);
    });
  }
}
