import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { RequeueService, RequeueModel } from 'services/requeue.service';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { Subscription } from 'rxjs/Subscription';
import { ContentItemContentModel } from 'services/content-item-content.service';
import { ContentItemMessageModel } from 'services/content-item.service';
import { CimListRequeueComponent } from '../components/cim/cim-list-requeue/cim-list-requeue.component';

@Component({
  selector: 'app-content-project-requeue-details-layout',
  templateUrl: './content-project-requeue-details-layout.component.html',
  styleUrls: ['./content-project-requeue-details-layout.component.css']
})
export class ContentProjectRequeueDetailsLayoutComponent implements OnInit, OnDestroy {
  currentQueue: RequeueModel = new RequeueModel();
  isLoading = false;

  subRoute: Subscription;

  @ViewChild('messageListComponent') messageListComponent: CimListRequeueComponent;

  constructor(
    private sharedService: ContentProjectShareService,
    private requeueService: RequeueService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Load the queue the user wants
    this.isLoading = true;

    // Make sure a project has been loaded (causes an error and shouldn't normally happen)
    if (!this.sharedService.currentProject.getValue().id) {
      console.warn('No project loaded');
      this.router.navigateByUrl('/content');
    }

    // Get the route to the page
    const subRoute = this.activatedRoute.params.subscribe(async params => {
      // Get the ID of the current param
      const queueId = params['queueId'];

      try {
        // Load the queue object
        const queue = await this.requeueService.getSingle(this.sharedService.currentProject.getValue().id, queueId).toPromise();
        console.log('Loaded queue', queue);
        this.currentQueue = queue;
      } catch (error) {
        // Error loading queue
        console.log('Error loading queue');
        this.tracking.TrackError('Error loading requeue', error);
        this.toast.error('Unable to load requeue, please try again later');
      } finally {
        // Loading complete
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.subRoute) { this.subRoute.unsubscribe(); };
  }

  async handleCreateMessage(message: ContentItemMessageModel) {
    // Add the message
    const newMessage = await this.requeueService.addMessage(this.currentQueue.ProjectId, this.currentQueue.id, message).toPromise();
    // Push the new message into the message queue
    this.currentQueue.Messages.push(newMessage);

    this.toast.success('Message has been added');
    this.messageListComponent.redraw();
  }

  async handleUpdateMessage(message: ContentItemMessageModel) {
    // Update the system
    await this.requeueService.updateMessage(this.currentQueue.ProjectId, this.currentQueue.id, message).toPromise();
    // Update the current queue object to match
    const index = this.currentQueue.Messages.findIndex(m => m.Id === message.Id);
    this.currentQueue.Messages[index] = message;

    this.toast.success('Message has been updated');
    this.messageListComponent.redraw();
  }

  async handleRemoveMessage(messageId: string) {
    console.log('Remove message', messageId);
    // Remove the message
    try {
      // Remove the message from the queue
      await this.requeueService.removeMessage(this.currentQueue.ProjectId, this.currentQueue.id, messageId).toPromise();

      // Update the page to match the removal
      const index = this.currentQueue.Messages.findIndex(m => m.Id === messageId);
      this.currentQueue.Messages.splice(index, 1);
      this.toast.success('Message has been removed');
      this.messageListComponent.redraw();
    } catch (error) {
      console.log('Delete error', error);
      this.toast.error('Unable to remove message. Please try again later');
      this.tracking.TrackError('Error removing message from requeue', error);
    }

  }
}
