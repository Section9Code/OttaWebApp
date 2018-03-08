import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { ContentProjectModel } from 'services/content-project.service';
import { Subscription } from 'rxjs/Subscription';
import { EventService, EventGroupModel } from 'services/event.service';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';

@Component({
    moduleId: module.id,
    selector: 'content-project-events-layout',
    templateUrl: 'content-project-events-layout.component.html',
    styleUrls: ['content-project-events-layout.component.scss']
})
export class ContentProjectEventsLayoutComponent implements OnInit, OnDestroy {
    isLoading = false;
    isLoadingPublicGroups = false;

    currentProject: ContentProjectModel;
    allPublicEventGroups: EventGroupModel[];

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
        this.eventService.getAllPublicEventGroups().toPromise()
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

    togglePublicGroup(group: EventGroupModel)
    {
        this.toast.success("Things");
    }

    ngOnDestroy(): void {
        // Unsubscribe from services
        if (this.currentProjectSub) this.currentProjectSub.unsubscribe();
    }
}
