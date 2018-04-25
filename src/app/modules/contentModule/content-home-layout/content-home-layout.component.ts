import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'services/auth.service';
import { OrganisationService } from 'services/organisation.service';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { ContentProjectService } from 'services/content-project.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'ng2-sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'content-home-layout',
    templateUrl: 'content-home-layout.component.html',
    styleUrls: ['content-home-layout.component.scss']
})
export class ContentHomeLayoutComponent implements OnInit {
    // Max number of projects the user can have
    maxProjects = 0;
    projectCount = 0;

    constructor(
        private tracking: MixpanelService,
        private toast: ToastsManager,
        private userService: AuthService,
        private orgService: OrganisationService,
        private projectService: ContentProjectService,
        private router: Router,
        private alertSvc: SweetAlertService) {
    }

    ngOnInit(): void {
        // Track
        this.tracking.Track(MixpanelEvent.ContentHome);

        // Get the users organisation to find out how many projects they can have
        this.orgService.get().toPromise()
            .then(org => {
                console.log('Max allowed projects', org.CurrentPlan.MaxProjects);
                this.maxProjects = org.CurrentPlan.MaxProjects;
            })
            .catch();

        // Get all the projects
        this.projectService.getProjects().toPromise()
            .then(projects => {
                console.log('Projects', projects.length);
                this.projectCount = projects.length;
            })
            .catch();
    }

    createProject() {
        if (this.projectCount < this.maxProjects) {
            // Send the user to the create page
            this.router.navigateByUrl('./create');
        }
        else {
            this.alertSvc.swal({
                title: 'Cannot create new project',
                text: 'You have reached the maximum number of projects your subscription allows. Would you like to update your subscription to allow more projects?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, view my subscription'
            }).then(() => {
                // Confirmed
                console.log('Confirmed');
                this.router.navigateByUrl('/organisation');
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
}
