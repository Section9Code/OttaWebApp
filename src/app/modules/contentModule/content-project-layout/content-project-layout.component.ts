import { Component, OnInit } from '@angular/core';
import { ContentProjectModel, ContentProjectService } from 'services/content-project.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { UserDataService } from 'services/user-data.service';

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
        private shareService: ContentProjectShareService,
        private userService: UserDataService) {
    }

    ngOnInit(): void {
        // Init is called when the user lands on the page
        console.log('Content project init');

        // Load the project
        this.isLoading = true;
        this.route.params.subscribe(
            params => {
                // The user has navigated to another page
                // Reload the view data and reset the shown tab
                const currentPage = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
                console.log('[PROJECT] View changed', currentPage)
                this.currentView = currentPage;

                // Is the user still in the same project
                const projectId = params['id'];
                if (this.shareService.currentProject.getValue().id !== projectId) {
                    this.projectId = params['id'];
                    this.shareService.loadProject(this.projectId);
                }

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
        this.router.navigateByUrl(`/content/${this.shareService.currentProject.getValue().id}/calendar`);
    }

    goToItems() {
        this.currentView = 'items';
        this.router.navigateByUrl(`/content/${this.shareService.currentProject.getValue().id}/items`);
    }

    goToPitches() {
        this.currentView = 'pitches';
        this.router.navigateByUrl(`/content/${this.shareService.currentProject.getValue().id}/pitches`);
    }

    goToEvents() {
        this.currentView = 'events';
        this.router.navigateByUrl(`/content/${this.shareService.currentProject.getValue().id}/events`);
    }

    goToRequeue() {
        this.currentView = 'requeue';
        this.router.navigateByUrl(`/content/${this.shareService.currentProject.getValue().id}/requeue`);
    }

    goToSettings() {
        this.currentView = 'settings';
        this.router.navigateByUrl(`/content/${this.shareService.currentProject.getValue().id}/settings`);
    }

    goToPersonas() {
        this.currentView = 'personas';
        this.router.navigateByUrl(`/content/${this.shareService.currentProject.getValue().id}/personas`);
    }
}

export enum ContentProjectView {
    Calendar,
    Drafts,
    Pitches,
    Events,
    Settings
}