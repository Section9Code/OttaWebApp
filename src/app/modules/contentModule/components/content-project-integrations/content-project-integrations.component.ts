import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ContentProjectIntegrationService, ProjectIntegrationModel, WordpressProjectIntegrationModel, IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ContentProjectModel } from 'services/content-project.service';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';

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
  integrations: ProjectIntegrationModel[] = [];
  wordpressIntegrations: ProjectIntegrationModel[] = [];
  mediumIntegrations: ProjectIntegrationModel[] = [];
  twitterIntegrations: ProjectIntegrationModel[] = [];

  // Forms
  wordpressForm: WordpressProjectIntegrationModel = new WordpressProjectIntegrationModel();

  constructor(
    private sharedService: ContentProjectShareService,
    private integrationService: ContentProjectIntegrationService,
    private toast: ToastsManager,
    private tracking: MixpanelService,
    private alertSvc: SweetAlertService
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
  }

  // Methods
  showWordpressForm() {
    this.wordpressForm = new WordpressProjectIntegrationModel();
    $('#wordpressModal').modal('show');
  }

  showTwitterForm() {
    this.isConnectingToTwitter = true;
    this.integrationService.twitterGetLogin(this.project.id).toPromise()
      .then(response => {
        console.log('Success', response);
        // Send the user to the twitter authentication page
        var url = response;
        var myWindow = window.open(url, 'twitterAuth', 'width=500,height=550');



        // Loop around a call back until the new integration is found
        let loopCount = 0;
        let integrationFound = false;
        let timer = setInterval(() => {
          // This loops around every few seconds looking for the new twitter integration
          console.log('Checking for integration', loopCount);

          // Call the integration service
          this.integrationService.getAll(this.project.id).toPromise()
            .then(newIntegrations => {
              console.log('Checking integrations');
              var newTwitterIntegration = newIntegrations.filter(i => i.IntegrationType === IntegrationTypes.Twitter);

              if (newTwitterIntegration.length > 0 && !integrationFound) {
                // New integration found
                integrationFound = true;  // Stops multiple promises returning at the same time, only the first one is counted
                console.log('Found new integration');
                this.sharedService.addIntegration(newTwitterIntegration[0]);
                this.isConnectingToTwitter = false;
                this.toast.success('Twitter is now connected to your project', 'Twitter connected');
                clearInterval(timer);
              }
            })
            .catch(newTwitterIntegrationError => {
              console.log('Twitter integration error - Ignore', newTwitterIntegrationError)
            });

          // Looped enough times, stop checking
          if (++loopCount >= 20) {
            console.log('Max limit reached, stopping');
            this.isConnectingToTwitter = false;
            this.toast.error('Unable to connect your project with twitter, please try again', 'Unable to connect');
            clearInterval(timer);
          }
        }, 2000);



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
        this.toast.error('Unable to add wordpress integration. Please check the website address is correct and the username and password are for an editor user', 'Unable to connect');
        this.isCreating = false;
      });
  }

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
}
