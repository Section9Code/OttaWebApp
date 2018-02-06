import { Component } from '@angular/core';
import { ContentItemModel, ContentItemService } from 'services/content-item.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { Router } from '@angular/router';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-create-layout',
    templateUrl: 'content-project-drafts-create-layout.component.html',
    styleUrls: ['content-project-drafts-create-layout.component.scss']
})
export class ContentProjectDraftsCreateLayoutComponent {
    contentItemData = new ContentItemModel();
    isUpdating = false;

    constructor(private sharedData: ContentProjectShareService, private router: Router, private contentItemService: ContentItemService,
        private tracking: MixpanelService, private toast: ToastsManager) {
    }

    createDraft(data: ContentItemModel) {
        console.log('Create draft');
        this.isUpdating = true;
        this.contentItemService.createDraft(this.sharedData.currentProject.getValue().id, data).subscribe(
            response => {
                this.toast.success('Draft created');
                this.tracking.Track(MixpanelEvent.Content_Draft_Created, { 'id': response})
                this.navigateBackToDrafts();
            },
            error => {
                this.toast.error('Unable to create draft');
                this.tracking.TrackError('Error occurred trying to create draft', error);
            },
            () => this.isUpdating = false
        );
    }

    cancelDraft() {
        console.log('Cancel draft');
        this.navigateBackToDrafts();
    }

    navigateBackToDrafts()
    {
        // Navigate back to drafts
        const url = `/content/${this.sharedData.currentProject.getValue().id}/drafts`;
        this.router.navigateByUrl(url);
    }
}
