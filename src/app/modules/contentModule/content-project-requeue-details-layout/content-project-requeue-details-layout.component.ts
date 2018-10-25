import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { RequeueService, RequeueModel, RequeueReducedModel, RequeueTimeSlot } from 'services/requeue.service';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { Subscription } from 'rxjs/Subscription';
import { ContentItemContentModel } from 'services/content-item-content.service';
import { ContentItemMessageModel } from 'services/content-item.service';
import { CimListRequeueComponent } from '../components/cim/cim-list-requeue/cim-list-requeue.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SweetAlertService } from 'ng2-sweetalert2';
import { TimeslotDisplayItem } from '../components/requeue-timeslots/requeue-timeslots.component';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { MessageMove } from '../components/cim/cim-messages-list/cim-messages-list.component';
import { OrganisationService } from 'services/organisation.service';

@Component({
  selector: 'app-content-project-requeue-details-layout',
  templateUrl: './content-project-requeue-details-layout.component.html',
  styleUrls: ['./content-project-requeue-details-layout.component.css']
})
export class ContentProjectRequeueDetailsLayoutComponent implements OnInit, OnDestroy {
  currentQueue = new RequeueModel();
  isLoading = false;
  isUpdating = false;

  settingsForm: FormGroup;
  subRoute: Subscription;

  @ViewChild('messageListComponent') messageListComponent: CimListRequeueComponent;

  constructor(
    private sharedService: ContentProjectShareService,
    private requeueService: RequeueService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertSvc: SweetAlertService
  ) {

    this.settingsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      colourHex: new FormControl('', Validators.required)
    });

  }

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

        // Update the form
        this.settingsForm.controls.name.patchValue(this.currentQueue.Name);
        this.settingsForm.controls.colourHex.patchValue(this.currentQueue.ColourHex);

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

  // User wants to create a new content item message for the requeue
  async handleCreateMessage(message: ContentItemMessageModel) {
    // Add the message
    const newMessage = await this.requeueService.addMessage(this.currentQueue.ProjectId, this.currentQueue.id, message).toPromise();
    // Push the new message into the message queue
    this.currentQueue.Messages.push(newMessage);

    this.toast.success('Message has been added');
    this.messageListComponent.redraw();
  }

  // User wants to update an existing message
  async handleUpdateMessage(message: ContentItemMessageModel) {
    // Update the system
    await this.requeueService.updateMessage(this.currentQueue.ProjectId, this.currentQueue.id, message).toPromise();
    // Update the current queue object to match
    const index = this.currentQueue.Messages.findIndex(m => m.Id === message.Id);
    this.currentQueue.Messages[index] = message;

    this.toast.success('Message has been updated');
    this.messageListComponent.redraw();
  }

  // User wants to remove a message
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

  // Move a message
  async handleMoveMessage(args: MessageMove) {
    console.log('MOVE', args);
    this.currentQueue.Messages = await this.requeueService.moveMessage(this.currentQueue.ProjectId, this.currentQueue.id, args.sourceIndex, args.targetIndex).toPromise();
    this.toast.success('Message moved');
    this.messageListComponent.redraw();
  }


  // Update the name of the requeue
  async updateRequeue() {
    if (this.settingsForm.valid) {
      // Update the queue
      this.isUpdating = true;
      this.currentQueue.Name = this.settingsForm.controls.name.value;
      this.currentQueue.ColourHex = this.settingsForm.controls.colourHex.value;

      // Update
      this.currentQueue = await this.requeueService.update(this.sharedService.currentProject.getValue().id, this.currentQueue).toPromise();

      // Update the shared list
      const q = new RequeueReducedModel();
      q.Id = this.currentQueue.id;
      q.Name = this.currentQueue.Name;
      q.Messages = this.currentQueue.Messages.length;
      q.ColourHex = this.currentQueue.ColourHex;
      q.TimeSlots = this.currentQueue.TimeSlots.length;
      q.ProjectId = this.currentQueue.ProjectId;
      this.sharedService.removeRequeue(this.currentQueue.id);
      this.sharedService.addRequeue(q);

      // Done
      this.isUpdating = false;
      this.toast.success('Requeue updated');
    }
  }

  deleteRequeue() {
    this.alertSvc.swal({
      title: 'Delete this requeue',
      text: 'Are you sure you want to delete this requeue?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async () => {
      // Confirmed
      await this.requeueService.delete(this.currentQueue.ProjectId, this.currentQueue.id).toPromise();
      this.sharedService.removeRequeue(this.currentQueue.id);
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
      this.toast.success('Requeue deleted');
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

  // Re-download the queue object from the system
  // Updating the whole object causes all attached components to refresh
  async forceReload() {
    // Force a reload of the whole requeue object to update all the child components
    this.currentQueue = await this.requeueService.getSingle(this.currentQueue.ProjectId, this.currentQueue.id).toPromise();
  }

  // The user has uploaded a new image to the queue
  async handleImageUploaded(imageUrl: string) {
    // Upload the new image
    await this.requeueService.addImage(this.currentQueue.ProjectId, this.currentQueue.id, imageUrl).toPromise();

    // Update the queue object
    await this.forceReload();

    this.toast.success('Image uploaded');
  }

  // The user wants to delete an image
  async handleImageDelete(imageUrl: string) {

    // Check the image isn't being used by any messages
    const messagesWithImage = this.currentQueue.Messages.filter(m => m.ImageUrl === imageUrl);
    if (messagesWithImage.length > 0) {
      this.toast.warning('This image is being used by messages in the queue. Remove the image from the messages before it can be deleted', 'Image cannot be removed');
      return;
    }

    // Confirm the image should be deleted
    this.alertSvc.swal({
      title: 'Delete image',
      text: "Are you sure you want to delete this image?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async () => {
      // Confirmed
      await this.requeueService.removeImage(this.currentQueue.ProjectId, this.currentQueue.id, imageUrl).toPromise();
      await this.forceReload();
      this.toast.success('Image removed');
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

  async handleAddTimeslot(timeslot: RequeueTimeSlot) {
    console.log('Add timeslot', timeslot);

    // Update the data
    this.currentQueue.TimeSlots.push(timeslot);
    await this.requeueService.addTimeslot(this.currentQueue.ProjectId, this.currentQueue.id, timeslot).toPromise();

    // Reload the queue object
    await this.forceReload();

    // Update the meta data
    const meta = this.sharedService.requeues.getValue().find(q => q.Id === this.currentQueue.id);
    meta.TimeSlots++;
    this.sharedService.updateRequeue(meta);

    // Done
    this.toast.success('Timeslot added');
  }

  handleRemoveTimeslot(id: string) {
    this.alertSvc.swal({
      title: 'Delete this timeslot',
      text: 'Are you sure you want to delete this timeslot?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async () => {
      // Confirmed
      // Update the data
      const index = this.currentQueue.TimeSlots.findIndex(ts => ts.Id === id);
      this.currentQueue.TimeSlots.splice(index, 1);
      await this.requeueService.removeTimeslot(this.currentQueue.ProjectId, this.currentQueue.id, id).toPromise();

      // Reload the queue object
      await this.forceReload();

      // Update the meta data
      const meta = this.sharedService.requeues.getValue().find(q => q.Id === this.currentQueue.id);
      meta.TimeSlots--;
      this.sharedService.updateRequeue(meta);

      // Done
      this.toast.success('Timeslot deleted');
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
