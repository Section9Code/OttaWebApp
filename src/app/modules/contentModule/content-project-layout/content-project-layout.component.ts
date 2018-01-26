import { Component, OnInit } from '@angular/core';
import { ContentProjectModel, ContentProjectService } from 'services/content-project.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { SweetAlertService } from 'ng2-sweetalert2';
import { UserDataService } from 'services/user-data.service';

@Component({
    moduleId: module.id,
    selector: 'content-project-layout',
    templateUrl: 'content-project-layout.component.html',
    styleUrls: ['content-project-layout.component.scss']
})
export class ContentProjectLayoutComponent implements OnInit {
    currentView = 'calendar';

    isAdmin = false;
    isLoading = false;
    projectId: string;
    project: ContentProjectModel = new ContentProjectModel();

    constructor(private tracking: MixpanelService, private toast: ToastsManager, private route: ActivatedRoute, private router: Router,
        private projectService: ContentProjectService, private userDataService: UserDataService, private alertSvc: SweetAlertService) {
    }

    ngOnInit(): void {
        this.isAdmin = this.userDataService.userIsOrgAdmin;

        // Load the project
        this.isLoading = true;
        this.route.params.subscribe(
            params => {
                this.projectId = params['id'];

                // Load the project
                this.projectService.getProject(this.projectId).subscribe(
                    response => {
                        console.log('Project loaded', response);
                        this.project = response;
                    },
                    error => {
                        console.log('Error loading project', error);
                        this.tracking.TrackError('Unable to load project', this.projectId);
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
            },
            error => console.log('Params error')
        );
    }

    goToCalendar() {
        this.currentView = 'calendar';
        this.router.navigateByUrl(`/content/${this.projectId}`);
    }

    goToDrafts() {
        this.currentView = 'drafts';
        this.router.navigateByUrl(`/content/${this.projectId}/drafts`);
    }

    goToPitches() {
        this.currentView = 'pitches';
        this.router.navigateByUrl(`/content/${this.projectId}/pitches`);
    }

    goToEvents() {
        this.currentView = 'events';
        this.router.navigateByUrl(`/content/${this.projectId}/events`);
    }

    goToSettings() {
        this.currentView = 'settings';
        this.router.navigateByUrl(`/content/${this.projectId}/settings`);
    }
}

export enum ContentProjectView
{
    Calendar,
    Drafts,
    Pitches,
    Events,
    Settings
}