import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ContentItemModel, ContentItemService, ContentItemMessageModel } from 'services/content-item.service';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { SweetAlertService } from 'ng2-sweetalert2';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { ContentItemMessageTwitterFormComponent } from '../content-item-message-twitter-form/content-item-message-twitter-form.component';
import { ImagesService } from 'services/images.service';

declare var $: any;

@Component({
  selector: 'otta-content-item-messages',
  templateUrl: './content-item-messages.component.html',
  styleUrls: ['./content-item-messages.component.css']
})
export class ContentItemMessagesComponent implements OnInit, OnDestroy {
  @Input() data: ContentItemModel = new ContentItemModel();
  images: string[] = [];

  // The list of messages to show to the user
  messages: DisplayContentItemMessageModel[] = [];
  hideMessagesInThePast = true;

  // Components
  @ViewChild('twitterMessageComponent') private twitterMessageComponent: ContentItemMessageTwitterFormComponent;

  constructor(
    private sharedService: ContentProjectShareService,
    private contentService: ContentItemService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private alertSvc: SweetAlertService,
    private imageStore: ImagesService
  ) { }

  ngOnInit(): void {
    // Generate the list of messages to show to the user
    this.redrawMessageList();
    this.loadImages();
  }

  ngOnDestroy(): void {
  }
  // Load images
  loadImages() {
    this.imageStore.getAllFilesInFolder(`contentItem/${this.data.id}`).toPromise()
      .then(response => this.images = response)
      .catch(() => { console.log('Error occurred loading images'); });
  }

  // Updates the message list with the view the user wants to see
  redrawMessageList() {
    if (this.data.SocialMediaMessages && this.data.SocialMediaMessages.length > 0) {
      // Sort the messages
      this.messages = this.sortMessages();
    } else {
      // No messages to show
      this.messages = [];
    }
  }

  sortMessages(): DisplayContentItemMessageModel[] {
    const outputMessages: DisplayContentItemMessageModel[] = [];

    // Sort the messages by date
    const list = this.data.SocialMediaMessages.sort((one, two) => (one.SendTime > two.SendTime ? 1 : -1));

    // Loop through all the messages, update them to the display type and remove any that should not be shown
    list.forEach(item => {
      if (this.messageIsInThePast(item)) {
        // Messages is in the past
        if (!this.hideMessagesInThePast) {
          // Past messages should be shown, add it too the list
          const msg: DisplayContentItemMessageModel = item as DisplayContentItemMessageModel;
          msg.hasBeenSent = true;
          outputMessages.push(msg);
        }
      }
      else {
        // This message hasn't been sent yet
        const msg: DisplayContentItemMessageModel = item as DisplayContentItemMessageModel;
        msg.hasBeenSent = false;
        outputMessages.push(msg);
      }
    });

    // Return the new message list
    return outputMessages;
  }

  messageIsInThePast(message: ContentItemMessageModel): boolean {
    if (!message.SendTime) { return false; }
    return message.SendTime < new Date().toISOString();
  }

  showAddTwitterMessage() {
    this.twitterMessageComponent.resetForm();
    $(`#addTwitterMessageModal`).modal('show');
  }

  editMessage(message: ContentItemMessageModel) {
    switch (message.MessageType) {
      case IntegrationTypes.Twitter:
        this.twitterMessageComponent.editMessage(message);
        $(`#addTwitterMessageModal`).modal('show');
        break;
    }
  }

  addedTwitterMessage(message: ContentItemMessageModel) {
    $(`#addTwitterMessageModal`).modal('hide');
    this.redrawMessageList();
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
          this.redrawMessageList();
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

export class DisplayContentItemMessageModel extends ContentItemMessageModel {
  hasBeenSent: boolean;
}
