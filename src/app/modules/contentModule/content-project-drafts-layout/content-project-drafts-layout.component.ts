import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { Router } from '@angular/router';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentItemService, ContentItemModel } from 'services/content-item.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-layout',
    templateUrl: 'content-project-drafts-layout.component.html',
    styleUrls: ['content-project-drafts-layout.component.scss']
})
export class ContentProjectDraftsLayoutComponent implements OnInit {
    drafts: ContentItemModel[] = [];
    draftsSub: Subscription;
    isLoading = false;
    searchCriteria = '';
    isFilteringSearch = false;

    constructor(private tracking: MixpanelService, private toast: ToastsManager, private router: Router,
        private sharedData: ContentProjectShareService, private contentItemService: ContentItemService) {
    }

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.Content_Draft_View);

        // Subscribe to draft loading
        this.sharedData.isLoadingDrafts.subscribe(
            response => this.isLoading = response
        );

        this.subscribeToAllDrafts();

        // Load the drafts
        this.sharedData.lazyLoadDrafts();
    }

    AddDraft() {
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

    clearSearch() {
        this.searchCriteria = '';
        this.isFilteringSearch = false;
        this.subscribeToAllDrafts();
    }

    subscribeToAllDrafts() {
        // Unsubscribe from any existing subscriptions
        if (this.draftsSub) {
            this.draftsSub.unsubscribe();
        }

        // Subscribe to all drafts
        this.draftsSub = this.sharedData.drafts.subscribe(
            response => this.drafts = response
        );
    }

    searchDrafts(criteria: string = '') {
        console.log('Search drafts', this.searchCriteria);

        // Check to see if the call has passed in a search criteria
        if (criteria !== '') {
            this.searchCriteria = criteria;
        }

        // Stop listening to the old subscription
        this.isFilteringSearch = true;
        this.draftsSub.unsubscribe();

        // Resubscribe, but filter the results
        this.draftsSub = this.sharedData.drafts.map(
            drafts => drafts.filter(draft => this.filterDraft(draft))).subscribe(
            response => this.drafts = response
            );
    }

    // Used when the user is searching to find matching drafts
    filterDraft(draft: ContentItemModel): boolean {
        if (draft.Title === this.searchCriteria) {
            return true;
        }

        if (draft.Description === this.searchCriteria) {
            return true;
        }

        if (draft.Tags) {
            if (draft.Tags.findIndex(tag => tag === this.searchCriteria) > -1) {
                return true;
            }
        }

        // Draft does not match search criteria
        return false;
    }
}
