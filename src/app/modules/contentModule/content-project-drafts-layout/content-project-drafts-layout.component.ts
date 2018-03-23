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
    contentItems: ContentItemModel[] = [];
    contentItemsSub: Subscription;
    isLoading = false;
    searchCriteria = '';
    isFilteringSearch = false;

    constructor(private tracking: MixpanelService, private toast: ToastsManager, private router: Router,
        private sharedData: ContentProjectShareService, private contentItemService: ContentItemService) {
    }

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.Content_Draft_View);

        // Subscribe to draft loading
        this.sharedData.isLoadingContentItems.subscribe(
            response => this.isLoading = response
        );

        this.subscribeToAllContentItems();

        // Load the drafts
        this.sharedData.lazyLoadContentItems();
    }

    AddItem() {
        let currentProjectId = this.sharedData.currentProject.getValue().id;
        let url = `/content/${currentProjectId}/items/create`;
        console.log('Navigating to:', url);
        this.router.navigateByUrl(url);
    }

    navigateToItem(item: ContentItemModel) {
        let currentProjectId = this.sharedData.currentProject.getValue().id;
        let url = `/content/${currentProjectId}/items/${item.id}`;
        console.log('Navigating to:', url);
        this.router.navigateByUrl(url);
    }

    clearSearch() {
        this.searchCriteria = '';
        this.isFilteringSearch = false;
        this.subscribeToAllContentItems();
    }

    subscribeToAllContentItems() {
        // Unsubscribe from any existing subscriptions
        if (this.contentItemsSub) {
            this.contentItemsSub.unsubscribe();
        }

        // Subscribe to all content items
        this.contentItemsSub = this.sharedData.contentItems.subscribe(
            response => this.contentItems = response
        );
    }

    search(criteria: string = '') {
        console.log('Search', this.searchCriteria);

        // Check to see if the call has passed in a search criteria
        if (criteria !== '') {
            this.searchCriteria = criteria;
        }

        // Stop listening to the old subscription
        this.isFilteringSearch = true;
        this.contentItemsSub.unsubscribe();

        // Resubscribe, but filter the results
        this.contentItemsSub = this.sharedData.contentItems.map(
            items => items.filter(item => this.filterContentItems(item))).subscribe(
            response => this.contentItems = response
            );
    }

    // Used when the user is searching to find matching content items
    filterContentItems(item: ContentItemModel): boolean {
        if (item.Title === this.searchCriteria) {
            return true;
        }

        if (item.Description === this.searchCriteria) {
            return true;
        }

        if (item.Tags) {
            if (item.Tags.findIndex(tag => tag === this.searchCriteria) > -1) {
                return true;
            }
        }

        // Content item does not match search criteria
        return false;
    }
}
