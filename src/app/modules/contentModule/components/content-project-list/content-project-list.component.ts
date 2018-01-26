import { Component, OnInit } from '@angular/core';
import { ContentProjectService, ContentProjectModel } from 'services/content-project.service';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { UserDataService } from 'services/user-data.service';

@Component({
    moduleId: module.id,
    selector: 'content-project-list',
    templateUrl: 'content-project-list.component.html',
    styleUrls: ['content-project-list.component.scss']
})
export class ContentProjectListComponent implements OnInit {
    isLoading = false;
    projects: ContentProjectModel[];
    newDateLimit: Date = new Date(2018, 0, 20);

    constructor(private projectService: ContentProjectService, private tracking: MixpanelService, private toast: ToastsManager) {
    }

    ngOnInit(): void {
        // Load the users projects
        this.isLoading = true;
        this.projectService.getProjects().subscribe(
            response => {
                console.log('Loaded projects', response);
                this.projects = response;
            },
            error => {
                this.tracking.TrackError('Unable to load users projects', error);
                this.toast.error('Unable to load your projects', 'Unable to load');
            },
            () => {
                this.isLoading = false;
            }
        );
    }

}
