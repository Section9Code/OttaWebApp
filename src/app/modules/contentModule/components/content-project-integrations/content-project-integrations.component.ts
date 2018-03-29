import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ContentProjectIntegrationService, ProjectIntegrationModel } from 'services/ContentProjectIntegration.service';
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
  integrations: ProjectIntegrationModel[];

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

  // Methods
  addWordpres() {
  }
}
