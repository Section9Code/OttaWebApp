import { Component, OnInit } from '@angular/core';
import { ContentProjectModel, ContentProjectService } from 'services/content-project.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { SweetAlertService } from 'ng2-sweetalert2';
import { UserDataService } from 'services/user-data.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';

@Component({
    moduleId: module.id,
    selector: 'content-project-layout',
    templateUrl: 'content-project-layout.component.html',
    styleUrls: ['content-project-layout.component.scss']
})
export class ContentProjectLayoutComponent implements OnInit {
    currentView = 'calendar';   // The current view the pages are on
    isLoading = false;          // Is the data loading
    isAdmin = false;            // Is the current user a project admin
    projectId = '';             // Id of the current project
    project: ContentProjectModel = new ContentProjectModel();   // Current project information

    constructor(
        private route: ActivatedRoute, 
        private router: Router, 
        private projectService: ContentProjectService, 
        private shareService: ContentProjectShareService, 
        private userDataService: UserDataService) {
    }

    ngOnInit(): void {
        // Init is called when the user lands on the page
        console.log('Content project init');
        
        // Load the project
        this.isLoading = true;
        this.route.params.subscribe(
            params => {
                // The user has navigated to another page
                console.log('Params changed');

                // Reload the view data and reset the shown tab
                this.currentView = 'calendar';
                this.projectId = params['id'];
                this.shareService.loadProject(this.projectId);
                this.isLoading = false;
            },
            error => console.log('Params error')
        );

        // Is the current user a project admin
        this.shareService.userIsAdmin.subscribe(response => this.isAdmin = response);

        // Subscribe the project information to the shared data
        this.shareService.currentProject.subscribe(response => this.project = response);
    }

    goToCalendar() {
        this.currentView = 'calendar';
        this.router.navigateByUrl(`/content/${this.projectId}`);
    }

    goToItems() {
        this.currentView = 'items';
        this.router.navigateByUrl(`/content/${this.projectId}/items`);
    }

    goToPitches() {
        this.currentView = 'pitches';
        this.router.navigateByUrl(`/content/${this.projectId}/pitches`);
    }

    goToEvents() {
        this.currentView = 'events';
        this.router.navigateByUrl(`/content/${this.projectId}/events`);
    }

    goToRequeue() {
        this.currentView = "requeue";
        this.router.navigateByUrl(`/content/${this.projectId}/requeue`);
    }

    goToSettings() {
        this.currentView = 'settings';
        this.router.navigateByUrl(`/content/${this.projectId}/settings`);
    }

    goToPersonas() {
        this.currentView = 'personas';
        this.router.navigateByUrl(`/content/${this.projectId}/personas`);
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