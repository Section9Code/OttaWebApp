import { Component, OnInit } from '@angular/core';
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
export class ContentProjectDraftsCreateLayoutComponent implements OnInit {
    contentItemData = new ContentItemModel();
    isUpdating = false;

    constructor(
        private sharedData: ContentProjectShareService,
        private router: Router,
        private contentItemService: ContentItemService,
        private contentItemContentService: ContentItemContentService,
        private tracking: MixpanelService, private toast: ToastsManager) {
    }

    ngOnInit(): void {
        // Content defauls
        this.contentItemData.ProjectId = this.sharedData.currentProject.getValue().id;
        this.contentItemData.State = 'idea';
    }

    create(data: ContentDataMessage) {
        console.log('Create item');
        this.isUpdating = true;

        // Create the content item
        this.contentItemService.createItem(this.sharedData.currentProject.getValue().id, data.contentItem).toPromise()
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
                                this.toast.success('Item created');
                                this.tracking.Track(MixpanelEvent.Content_Draft_Created, { 'id': newContentItem });
                                // Update the list of items
                                this.sharedData.addContent(newContentItem);

                                // Where should the user go next
                                if (data.closeOnCompletion) {
                                    // They want to close the item when they are done
                                    this.navigateBackToList();
                                }
                                else {
                                    // They want to keep editing the item
                                    this.navigateToContentItem(newContentItem.id);
                                }
                            }
                        )
                        .catch(
                            // Error occurred while trying try store the content of the item
                            contentError => {
                                this.toast.error('Unable to create item content');
                                this.tracking.TrackError('Error occurred trying to store the content of the item', contentError);
                            }
                        );
                }
            )
            .catch(
                // Error occurred while trying to save content item
                error => {
                    this.toast.error('Unable to create item');
                    this.tracking.TrackError('Error occurred trying to create item', error);
                }
            );
    }

    cancel() {
        console.log('Cancel item');
        this.navigateBackToList();
    }

    navigateBackToList() {
        // Navigate back to items
        const url = `/content/${this.sharedData.currentProject.getValue().id}/items`;
        this.router.navigateByUrl(url);
    }

    navigateToContentItem(id: string) {
        // Navigate back to items
        const url = `/content/${this.sharedData.currentProject.getValue().id}/items/${id}`;
        this.router.navigateByUrl(url);
    }
}
