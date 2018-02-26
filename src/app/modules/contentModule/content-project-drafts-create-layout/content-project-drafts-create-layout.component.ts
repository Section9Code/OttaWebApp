import { Component } from '@angular/core';
import { ContentItemModel, ContentItemService } from 'services/content-item.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { Router } from '@angular/router';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { ContentItemContentService, ContentItemContentModel } from 'services/content-item-content.service';
import { ContentDataMessage } from '../components/content-item-details/content-item-details.component';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-create-layout',
    templateUrl: 'content-project-drafts-create-layout.component.html',
    styleUrls: ['content-project-drafts-create-layout.component.scss']
})
export class ContentProjectDraftsCreateLayoutComponent {
    contentItemData = new ContentItemModel();
    isUpdating = false;

    constructor(
        private sharedData: ContentProjectShareService,
        private router: Router,
        private contentItemService: ContentItemService,
        private contentItemContentService: ContentItemContentService,
        private tracking: MixpanelService, private toast: ToastsManager) {
    }

    createDraft(data: ContentDataMessage) {
        console.log('Create draft');
        this.isUpdating = true;

        // Create the content item
        this.contentItemService.createDraft(this.sharedData.currentProject.getValue().id, data.contentItem).toPromise()
            .then(
                // Content item saved
                newContentItem => {

                    // Add the content to the system
                    const newContent = new ContentItemContentModel();
                    newContent.Content = data.content;
                    newContent.ParentContentItemId = newContentItem.id;

                    // Store the content for the item
                    this.contentItemContentService.addContent(newContent).toPromise()
                        .then(
                            response => {
                                this.toast.success('Draft created');
                                this.tracking.Track(MixpanelEvent.Content_Draft_Created, { 'id': newContentItem });
                                // Update the list of drafts
                                this.sharedData.addDraft(newContentItem);
                                // Navigate back to the list of drafts
                                this.navigateBackToDrafts();
                            }
                        )
                        .catch(
                            // Error occured while trying try store the content of the draft
                            contentError => {
                                this.toast.error('Unable to create draft content');
                                this.tracking.TrackError('Error occurred trying to store the content of the draft', contentError);
                            }
                        );
                }
            )
            .catch(
                // Error occurred while trying to save content item
                error => {
                    this.toast.error('Unable to create draft');
                    this.tracking.TrackError('Error occurred trying to create draft', error);
                }
            );
    }

    cancelDraft() {
        console.log('Cancel draft');
        this.navigateBackToDrafts();
    }

    navigateBackToDrafts() {
        // Navigate back to drafts
        const url = `/content/${this.sharedData.currentProject.getValue().id}/drafts`;
        this.router.navigateByUrl(url);
    }
}
