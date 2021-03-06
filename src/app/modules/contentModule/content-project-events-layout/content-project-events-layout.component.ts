import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { ContentProjectModel } from 'services/content-project.service';
import { Subscription } from 'rxjs/Subscription';
import { EventService, EventGroupModel, EventGroupModelGrouped } from 'services/event.service';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';

@Component({
    moduleId: module.id,
    selector: 'content-project-events-layout',
    templateUrl: 'content-project-events-layout.component.html',
    styleUrls: ['content-project-events-layout.component.scss']
})
export class ContentProjectEventsLayoutComponent implements OnInit, OnDestroy {
    isLoadingPublicGroups = false;

    currentProject: ContentProjectModel;
    allPublicEventGroups: EventGroupModelGrouped[];

    currentProjectSub: Subscription;

    constructor(
        private sharedDataService: ContentProjectShareService,
        private eventService: EventService,
        private toast: ToastsManager,
        private tracking: MixpanelService) {
    }

    ngOnInit(): void {
        // Load the current project
        this.currentProjectSub = this.sharedDataService.currentProject.subscribe(
            response => {
                console.log('Events: Loaded project', response);
                this.currentProject = response;
            }
        );

        // Load all the public event groups
        this.isLoadingPublicGroups = true;
        this.eventService.getAllPublicEventGroupsGrouped().toPromise()
            .then(response => {
                console.log('Events: Loaded public groups', response);
                this.allPublicEventGroups = response;
                this.isLoadingPublicGroups = false;
            })
            .catch(error => {
                this.toast.error('Unable to load public event groups');
                this.tracking.TrackError('Unable to load public event groups', error);
            }
            );
    }

    ngOnDestroy(): void {
        // Unsubscribe from services
        if (this.currentProjectSub) this.currentProjectSub.unsubscribe();
    }

    togglePublicGroup(group: EventGroupModel) {
        // Is this group already in the list of project event groups
        if (this.isGroupInProjectList(group.id)) {
            // Already on the list, remove it
            this.removeEventGroup(group);
        } else {
            this.addEventGroup(group);
        }
    }

    addEventGroup(group: EventGroupModel) {
        // Add the event group to the users project
        this.eventService.addPublicEventGroupToProject(this.currentProject.id, group.id).toPromise()
            .then(() => {
                // Update the project and push it too the shared services
                this.currentProject.PublicEventGroups.push(group.id);
                this.sharedDataService.updateProject(this.currentProject);
                // Inform the user
                this.toast.success(`${group.Name} has been added to your events`, 'Added');
            })
            .catch(error => console.log('Error occurred updating users group', error));
    }

    removeEventGroup(group: EventGroupModel) {
        // Remove the event group to the users project
        this.eventService.removePublicEventGroupFromProject(this.currentProject.id, group.id).toPromise()
            .then(() => {
                // Remove the group from the list of project event groups
                var index: number = this.currentProject.PublicEventGroups.findIndex(x => x === group.id);
                if (index > -1) {
                    this.currentProject.PublicEventGroups.splice(index, 1);
                }
                this.sharedDataService.updateProject(this.currentProject);
                // Inform the user
                this.toast.success(`${group.Name} has been removed from your events`, 'Removed');
            })
            .catch(error => console.log('Error occurred updating users group', error));
    }


    isGroupInProjectList(id: string): boolean {
        // Make sure the project data exists
        if (!this.currentProject || !this.currentProject.PublicEventGroups) {
            return false;
        }

        // Find the group in the list of groups
        const index = this.currentProject.PublicEventGroups.findIndex(i => i === id);
        return index !== -1;
    }
}
