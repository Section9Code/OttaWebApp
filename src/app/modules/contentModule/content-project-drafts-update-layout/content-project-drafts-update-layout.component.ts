import { Component, OnInit } from '@angular/core';
import { ContentItemModel, ContentItemService } from 'services/content-item.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { MixpanelService } from 'services/mixpanel.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-update-layout',
    templateUrl: 'content-project-drafts-update-layout.component.html',
    styleUrls: ['content-project-drafts-update-layout.component.scss']
})
export class ContentProjectDraftsUpdateLayoutComponent implements OnInit{
    projectId: string;
    draftId: string;
    draft: ContentItemModel = new ContentItemModel();
    isLoading = false;
    isUpdating = false;

    constructor(private router: Router, private route: ActivatedRoute, private toast: ToastsManager, private tracking: MixpanelService,
        private sharedData: ContentProjectShareService, private contentItemService: ContentItemService) {
        }

    ngOnInit(): void {
        // Load the draft the user has selected
        this.isLoading = true;
        this.route.params.subscribe(response => {
            this.projectId = response['id'];
            this.draftId = response['id2'];
            this.contentItemService.getDraft(this.projectId, this.draftId).subscribe(
                data => {
                    console.log('Loaded draft', data);
                    this.draft = data;
                },
                error => {
                    this.toast.error('Unable to load draft');
                    this.tracking.TrackError('Unable to load draft', error);
                },
                () => this.isLoading = false
            );
        });
    }

    updateDraft(data: ContentItemModel) {
        console.log('Update draft', data);
        this.isUpdating = true;
        this.contentItemService.updateDraft(data).subscribe(
            response => {
                this.sharedData.updateDraft(data);
                this.toast.success('Draft updated');
                this.navigateBackToDrafts();
            },
            error => {
                this.toast.error('Unable to update draft')
                this.tracking.TrackError('Unable to update draft', error);
            },
            () => {
                this.isUpdating = false;
            }
        );
    }

    navigateBackToDrafts()
    {
        // Navigate back to drafts
        const url = `/content/${this.sharedData.currentProject.getValue().id}/drafts`;
        this.router.navigateByUrl(url);
    }
}
