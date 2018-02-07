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

        // Subscribe to draft loading
        this.sharedData.isLoadingDrafts.subscribe(
            response => this.isLoading = response
        );

        // Subscribe to drafts
        this.sharedData.drafts.subscribe(
            response => this.drafts = response
        );

        // Load the drafts
        this.sharedData.lazyLoadDrafts();
    }

    AddDraft(){
        let currentProjectId = this.sharedData.currentProject.getValue().id;
        let url = `/content/${currentProjectId}/drafts/create`;
        console.log('Navigating to:', url);
        this.router.navigateByUrl(url);
    }

    navigateToDraft(draft: ContentItemModel) {
        let currentProjectId = this.sharedData.currentProject.getValue().id;
        let url = `/content/${currentProjectId}/drafts/${draft.id}`;
        console.log('Navigating to:', url);
        this.router.navigateByUrl(url);
    }
}
