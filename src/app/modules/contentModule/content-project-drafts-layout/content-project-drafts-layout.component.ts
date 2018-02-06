import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { Router } from '@angular/router';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentItemService, ContentItemModel } from 'services/content-item.service';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-layout',
    templateUrl: 'content-project-drafts-layout.component.html',
    styleUrls: ['content-project-drafts-layout.component.scss']
})
export class ContentProjectDraftsLayoutComponent implements OnInit {
    drafts: ContentItemModel[] = [];
    isLoading = false;

    constructor(private tracking: MixpanelService, private toast: ToastsManager, private router: Router,
        private sharedData: ContentProjectShareService, private contentItemService: ContentItemService) {
    }

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.Content_Draft_View);

        // Load the drafts
        this.isLoading = true;
        this.contentItemService.getDrafts(this.sharedData.currentProject.getValue().id).subscribe(
            response => {
                console.log('Loaded drafts', response);
                this.drafts = response;
            },
            error => {
                this.toast.error('Error occurred trying to load drafts');
                this.tracking.TrackError('Error loading drafts', error);
            },
            () => this.isLoading = false
        );
    }

    AddDraft(){
        let currentProjectId = this.sharedData.currentProject.getValue().id;
        let url = `/content/${currentProjectId}/drafts/create`;
        console.log('Navigating to:', url);
        this.router.navigateByUrl(url);
    }
}
