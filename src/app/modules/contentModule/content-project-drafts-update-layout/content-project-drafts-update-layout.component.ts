import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentItemModel, ContentItemService } from 'services/content-item.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { MixpanelService } from 'services/mixpanel.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentItemContentModel, ContentItemContentService } from 'services/content-item-content.service';
import { ContentDataMessage } from '../components/content-item-details/content-item-details.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-update-layout',
    templateUrl: 'content-project-drafts-update-layout.component.html',
    styleUrls: ['content-project-drafts-update-layout.component.scss']
})
export class ContentProjectDraftsUpdateLayoutComponent implements OnInit, OnDestroy {
    projectId: string;
    draftId: string;
    draft: ContentItemModel = new ContentItemModel();
    draftContent: ContentItemContentModel = new ContentItemContentModel();
    isLoading = false;
    isUpdating = false;

    // Subscriptions
    routeSub: Subscription;
    contentItemSub: Subscription;
    contentItemContentSub: Subscription;

    constructor(private router: Router, private route: ActivatedRoute, private toast: ToastsManager, private tracking: MixpanelService,
        private sharedData: ContentProjectShareService, private contentItemService: ContentItemService,
        private contentItemContentService: ContentItemContentService) {
    }

    ngOnInit(): void {
        // Load the draft the user has selected
        this.isLoading = true;
        this.routeSub = this.route.params.subscribe(response => {
            this.projectId = response['id'];
            this.draftId = response['id2'];

            this.contentItemSub = this.contentItemService.getDraft(this.projectId, this.draftId).subscribe(
                data => {
                    console.log('Loaded draft', data);
                    this.draft = data;

                    // Get the latest content of this content item
                    this.contentItemContentSub = this.contentItemContentService.getLatestContent(this.draft.id).subscribe(
                        contentResponse => this.draftContent = contentResponse
                    );

                },
                error => {
                    this.toast.error('Unable to load draft');
                    this.tracking.TrackError('Unable to load draft', error);
                },
                () => this.isLoading = false
            );
        });
    }

    ngOnDestroy(): void {
        if (this.routeSub) { this.routeSub.unsubscribe(); }
        if (this.contentItemSub) { this.contentItemSub.unsubscribe(); }
        if (this.contentItemContentSub) { this.contentItemContentSub.unsubscribe(); }
    }

    updateDraft(data: ContentDataMessage) {
        console.log('Update draft', data);
        this.isUpdating = true;

        // Update the draft
        this.contentItemService.updateDraft(data.contentItem).toPromise()
            .then(response => {
                // Draft item updated
                const contentItem = new ContentItemContentModel();
                contentItem.Content = data.content;
                contentItem.ParentContentItemId = response.id;
                this.contentItemContentService.addContent(contentItem).toPromise()
                    .then(contentResponse => {
                        // Content updated
                        this.sharedData.updateDraft(response);
                        this.toast.success('Draft updated');
                        this.navigateBackToDrafts();
                    })
                    .catch(error => {
                        // Error storing content
                        this.toast.error('Unable to store content')
                        this.tracking.TrackError('Unable to store content', error);
                    });
            })
            .catch(error => {
                // Unable to update draft item
                this.toast.error('Unable to update draft')
                this.tracking.TrackError('Unable to update draft', error);
            });

    }

    navigateBackToDrafts() {
        // Navigate back to drafts
        const url = `/content/${this.sharedData.currentProject.getValue().id}/drafts`;
        this.router.navigateByUrl(url);
    }
}
