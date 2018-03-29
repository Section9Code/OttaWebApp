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
  integrations: ProjectIntegrationModel[] = [];
  wordpressIntegrations: ProjectIntegrationModel[] = [];
  mediumIntegrations: ProjectIntegrationModel[] = [];

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
    console.log('Sorted integrations', this.wordpressIntegrations);
    console.log('Sorted integrations', this.wordpressIntegrations.length);
  }

  // Methods
  showWordpressForm() {
    this.wordpressForm = new WordpressProjectIntegrationModel();
    $('#wordpressModal').modal('show');
  }

  addWordpressIntegration() {
    console.log('Add wordpress integration');

    // Add the wordpress integration
    this.isCreating = true;
    this.integrationService.addWordpressIntegration(this.project.id, this.wordpressForm).toPromise()
      .then(response => {
        console.log('Integration added', response);
        this.sharedService.addIntegration(response);
        this.toast.success('We were able to successfully connect to your site, integration added','Integration added');
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
      text: "Are you sure you want to remove this integration?",
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
