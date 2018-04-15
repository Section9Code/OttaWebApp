import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentItemModel, ContentItemService } from 'services/content-item.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { MixpanelService } from 'services/mixpanel.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentItemContentModel, ContentItemContentService } from 'services/content-item-content.service';
import { ContentDataMessage } from '../components/content-item-details/content-item-details.component';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from 'services/auth.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ProjectIntegrationModel, ContentProjectIntegrationService } from 'services/ContentProjectIntegration.service';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-update-layout',
    templateUrl: 'content-project-drafts-update-layout.component.html',
    styleUrls: ['content-project-drafts-update-layout.component.scss']
})
export class ContentProjectDraftsUpdateLayoutComponent implements OnInit, OnDestroy {
    projectId: string;  // Passed in from the url
    itemId: string;     // Passed in from the url
    item: ContentItemModel = new ContentItemModel();
    itemContent: ContentItemContentModel = new ContentItemContentModel();
    isLoading = false;
    isCreatingLink = false;
    isUpdating = false;
    userIsAdmin = false;
    currentUsersAuthId = '';

    // Subscriptions
    routeSub: Subscription;
    contentItemSub: Subscription;
    contentItemContentSub: Subscription;
    isAdminSub: Subscription;

    // Integrations
    hasWordpressIntegration = false;
    isUpdatingWPPost = false;
    isDeletingWPPost = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastsManager,
        private tracking: MixpanelService,
        private sharedData: ContentProjectShareService,
        private contentItemService: ContentItemService,
        private contentItemContentService: ContentItemContentService,
        private integrationService: ContentProjectIntegrationService,
        private auth: AuthService,
        private alertSvc: SweetAlertService
    ) { }

    ngOnInit(): void {
        // Load the item the user has selected
        this.isLoading = true;
        this.routeSub = this.route.params.subscribe(response => {
            this.projectId = response['id'];
            this.itemId = response['id2'];

            // Load the content item
            this.contentItemSub = this.contentItemService.getItem(this.projectId, this.itemId).subscribe(
                data => {
                    console.log('Loaded content item', data);
                    this.item = data;

                    // Get the latest content of this content item
                    this.contentItemContentSub = this.contentItemContentService.getLatestContent(this.item.id).subscribe(
                        contentResponse => this.itemContent = contentResponse
                    );

                },
                error => {
                    this.toast.error('Unable to load item');
                    this.tracking.TrackError('Unable to load item', error);
                },
                () => this.isLoading = false
            );
        });

        // Is the user an admin
        this.isAdminSub = this.sharedData.userIsAdmin.subscribe(
            response => this.userIsAdmin = response
        );

        // Integrations
        this.hasWordpressIntegration = this.sharedData.hasWordpressIntegration();

        // Get the current users profile
        this.currentUsersAuthId = this.auth.currentUserAuthId();
    }

    ngOnDestroy(): void {
        if (this.routeSub) { this.routeSub.unsubscribe(); }
        if (this.contentItemSub) { this.contentItemSub.unsubscribe(); }
        if (this.contentItemContentSub) { this.contentItemContentSub.unsubscribe(); }
        if (this.isAdminSub) { this.isAdminSub.unsubscribe() };
    }

    updateItem(data: ContentDataMessage, closeOnCompletion: boolean = false) {
        console.log('Update draft', data);
        this.isUpdating = true;

        // Update the content item
        this.contentItemService.updateItem(data.contentItem).toPromise()
            .then(response => {
                // Item updated
                this.item = response;

                // Update the item's content
                const contentItem = new ContentItemContentModel();
                contentItem.Content = data.content;
                contentItem.ParentContentItemId = response.id;
                this.contentItemContentService.addContent(contentItem).toPromise()
                    .then(contentResponse => {
                        // Content updated
                        this.sharedData.updateContent(response);
                        this.toast.success('Item updated');
                        this.isUpdating = false;
                        this.itemContent = contentResponse;

                        // Close if required
                        if (closeOnCompletion) {
                            this.navigateBackToItems();
                        }
                    })
                    .catch(error => {
                        // Error storing content
                        this.toast.error('Unable to store content')
                        this.tracking.TrackError('Unable to store content', error);
                        this.isUpdating = false;
                    });
            })
            .catch(error => {
                // Unable to update draft item
                this.toast.error('Unable to update item')
                this.tracking.TrackError('Unable to update item', error);
                this.isUpdating = false;
            });

    }

    deleteItem() {
        console.log('Delete item');
        // Confirm the user wants to delete the item
        this.alertSvc.swal({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this item?<br/>Once deleted it can not be restored",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            // Confirmed
            console.log('Confirmed');

            // Delete the item
            this.contentItemService.delete(this.item).toPromise()
                .then(deleteResponse => {
                    console.log('Item successfully deleted', deleteResponse);
                    this.toast.success('The item has been deleted', 'Item deleted');
                    this.sharedData.deleteContent(this.item.id);
                    this.navigateBackToItems();
                })
                .catch(deleteError => {
                    console.log('Error occurred while deleting', deleteError);
                    this.toast.error('Unable to delete content item', 'Can not delete');
                    this.tracking.TrackError(`Unable to delete content item ${this.item.id}`, deleteError);
                });

        },
            error => {
                // User cancelled
            },
            () => {
                // Complete
            }
        );
    }

    navigateBackToItems() {
        // Navigate back to drafts
        const url = `/content/${this.sharedData.currentProject.getValue().id}/items`;
        this.router.navigateByUrl(url);
    }

    createWordpressPost() {
        console.log('Link item to wordpress');

        if (!this.item.DeadLine) {
            this.toast.error('A post must have a deadline before it can be added to your wordpress site', 'Information');
            return;
        }

        // Create the blog post
        this.isCreatingLink = true;
        this.integrationService.createWordpressForItem(this.item.ProjectId, this.item.id).toPromise()
            .then(response => {
                // Link the item to its blog post
                this.item.WordpressLink = response;
                this.sharedData.updateContent(this.item);
                this.toast.success('Blog post create');
                this.isCreatingLink = false;
            })
            .catch(error => {
                console.log('Error while creating blog post');
                this.tracking.TrackError('Error creating blog post for content item');
                this.toast.error('Unable to create blog post', error);
                this.isCreatingLink = false;
            });
    }

    updateWordpressPost() {
        console.log('Update wordpress post');

        // Make sure there is a linked wordpress post        
        if (this.item.WordpressLink) {

            // Alert the user
            this.alertSvc.swal({
                title: 'Update content',
                text: "Are you sure you want to <strong>update</strong>?<br/><br/>Any changes you have made to the content of the blog post will be replaced.",
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!'
            }).then(() => {
                // Confirmed
                console.log('Confirmed');

                // Update the post
                this.isUpdatingWPPost = true;
                this.integrationService.updateWordpressForItem(this.item.ProjectId, this.item.id).toPromise()
                    .then(updateResponse => {
                        this.item.WordpressLink = updateResponse;
                        this.sharedData.updateContent(this.item);
                        this.toast.success('Blog post updated');
                        this.isUpdatingWPPost = false;
                    })
                    .catch(updateError => {
                        console.log('Error while updating blog post');
                        this.tracking.TrackError('Error updating blog post for content item');
                        this.toast.error('Unable to update blog post', updateError);
                        this.isUpdatingWPPost = false;
                    });
            },
                error => {
                    // Error
                    console.log('Alert dismissed');
                },
                () => {
                    // Complete
                }
            );
        }

    }

    deleteWordpressPost() {
        console.log('Delete wordpress post');

        // Confirm action with user
        this.alertSvc.swal({
            title: 'Delete post',
            text: "Are you sure you want to <strong>delete</strong> this wordpress post?<br/><br/>Any changed you have made on your site will be lost",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            // Confirmed
            console.log('Confirmed');

            this.isDeletingWPPost = true;
            this.integrationService.deleteWordpressForItem(this.item.ProjectId, this.item.id).toPromise()
                .then(deleteResponse => {
                    // WP post deleted
                    this.item.WordpressLink = null;
                    this.sharedData.updateContent(this.item);
                    this.toast.success('Blog post deleted');
                    this.isDeletingWPPost = false;
                })
                .catch(deleteError => {
                    // Error deleting WP post
                    console.log('Error while deleting blog post');
                    this.tracking.TrackError('Error deleting blog post for content item');
                    this.toast.error('Unable to deleting blog post', deleteError);
                    this.isDeletingWPPost = false;
                });
        },
            error => {
                // Error
                console.log('Alert dismissed');
            },
            () => {
                // Complete
            }
        );
    }
}
