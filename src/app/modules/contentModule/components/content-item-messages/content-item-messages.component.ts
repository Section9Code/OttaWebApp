import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ContentItemModel, ContentItemService, ContentItemMessageModel } from 'services/content-item.service';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { SweetAlertService } from 'ng2-sweetalert2';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';

declare var $: any;

@Component({
  selector: 'otta-content-item-messages',
  templateUrl: './content-item-messages.component.html',
  styleUrls: ['./content-item-messages.component.css']
})
export class ContentItemMessagesComponent implements OnInit, OnDestroy {
  @Input() data: ContentItemModel = new ContentItemModel();

  newMessage = new ContentItemMessageModel();
  isCreatingMessage = false;

  hideMessagesInThePast = true;

  constructor(
    private sharedService: ContentProjectShareService,
    private contentService: ContentItemService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private alertSvc: SweetAlertService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  messageIsInThePast(message: ContentItemMessageModel): boolean {
    if (!message.SendTime) { return false; }
    return message.SendTime < new Date().toISOString();
  }

  sortedMessages(): ContentItemMessageModel[] {
    // Sort the messages by date
    var messages = this.data.SocialMediaMessages.sort((one, two) => (one.SendTime > two.SendTime ? 1 : -1));

    // Remove messages in the past if they should not be shown
    if(this.hideMessagesInThePast)
    {
      messages = messages.filter(m => !this.messageIsInThePast(m));
    }

    return messages;
  }

  showAddTwitterMessage() {
    this.newMessage = new ContentItemMessageModel();
    $(`#addMessageModal`).modal('show');
  }

  addTwitterMessage() {
    console.log('Add message', this.newMessage);
    this.isCreatingMessage = true;

    // Update the message
    this.newMessage.MessageType = IntegrationTypes.Twitter;
    this.newMessage.ImageUrl = '';
    this.newMessage.Title = '';

    // Add the message
    this.contentService.addMessage(this.data.ProjectId, this.data.id, this.newMessage).toPromise()
      .then(
        response => {
          console.log('Message created');
          this.data.SocialMediaMessages.push(this.newMessage);
          this.sharedService.updateContent(this.data);
          this.toast.success('Social media message added');
          this.isCreatingMessage = false;
          $(`#addMessageModal`).modal('hide');
        })
      .catch(
        error => {
          console.log('Error creating message', error);
          this.tracking.TrackError('Error while creating social media message', error);
          this.toast.error('Unable to create social media message', 'Error');
          this.isCreatingMessage = false;
        });
  }

  deleteTwitterMessage(messageId: string) {
    console.log('Delete message');
    this.alertSvc.swal({
      title: 'Delete message',
      text: 'Are you sure you want to delete this message',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      console.log('Confirmed');
      this.contentService.deleteMessage(this.data.ProjectId, this.data.id, messageId).toPromise()
        .then(deleteMessageResponse => {
          // Rmove the message from the list
          const index = this.data.SocialMediaMessages.findIndex(i => i.Id === messageId);
          this.data.SocialMediaMessages.splice(index, 1);
          this.sharedService.updateContent(this.data);
          // Tell the user
          this.toast.success('Message deleted');
        })
        .catch(
          deleteMessageError => {
            console.log('Error deleting message', deleteMessageError);
            this.toast.error('Unable to delete message');
            this.tracking.TrackError('Error deleting content item message', deleteMessageError);
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
