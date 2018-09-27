import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { ContentItemMessageModel, ContentItemMessageSubstitution, ContentItemModel, ContentItemService } from 'services/content-item.service';
import { ImagesService } from 'services/images.service';
import { ToastsManager } from 'ng2-toastr';
import { SweetAlertService } from 'ng2-sweetalert2';
import { MixpanelService } from 'services/mixpanel.service';
import { ContentProjectShareService } from '../../../services/ContentProjectShareService';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { Subscription } from 'rxjs/Subscription';
import { ICimEditorCommon } from '../cim-editor-common';

// JQuery command for modal dialogs
declare var $: any;

// Usage
//
// <app-otta-cim-list [message]="object.messages" [substitutions]="object.substitutionsList" [contentItem]="object" (substitutionAdded)="handleEvent($event)"></app-otta-cim-list>
//

@Component({
  selector: 'app-otta-cim-list',
  templateUrl: './cim-list.component.html',
  styleUrls: ['./cim-list.component.css']
})
export class CimListComponent implements OnInit, OnDestroy {
  // The list of messages to show
  @Input() messages: ContentItemMessageModel[] = [];
  // The list of substitutions for this list
  @Input() substitutions: ContentItemMessageSubstitution[] = [];
  // The ID of the content item the list is for
  @Input() contentItem: ContentItemModel;

  // Called when substition actions happen
  @Output() substitutionAdded = new EventEmitter<ContentItemMessageSubstitution>();
  @Output() substitutionRemoved = new EventEmitter<ContentItemMessageSubstitution>();
  @Output() substitutionValueUpdated = new EventEmitter<ContentItemMessageSubstitution>();

  // The list of images available to the editors
  images: string[] = [];

  // The list of messages to show to the user
  messagesList: ShowContentItemMessageModel[] = [];
  hideMessagesInThePast = true;
  substitutionsList: ContentItemMessageSubstitution[] = [];

  // Subscriptions
  subIntegrations: Subscription;

  // Flags
  noIntegrations = true;
  canAddTwitterMessages = false;
  canAddFacebookMessages = false;
  canAddLinkedInMessages = false;
  canAddPinterestMessages = false;
  canAddMediumMessages = false;

  // Editor components
  @ViewChild('twitterEditor') private twitterEditor: ICimEditorCommon;
  @ViewChild('facebookEditor') private facebookEditor: ICimEditorCommon;

  constructor(
    private sharedService: ContentProjectShareService,
    private contentService: ContentItemService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private alertSvc: SweetAlertService,
    private imageStore: ImagesService) { }

  ngOnInit() {
    this.redrawMessageList();
    this.loadIntegrationOptions();
    this.loadImages();
    this.loadContentSubstitutions();
  }

  ngOnDestroy() {
    if (this.subIntegrations) { this.subIntegrations.unsubscribe(); }
  }

  // Called from the parent control if it needs to have this control update itself
  public update() {
    this.redrawMessageList();
    this.loadContentSubstitutions();
  }

  private loadContentSubstitutions() {
    // Clear the list
    this.substitutionsList = [];

    // Add the calculated substitutions if there is a content item
    if (this.contentItem) {
      this.substitutionsList.push(new ContentItemMessageSubstitution('title', this.contentItem.Title));
      this.substitutionsList.push(new ContentItemMessageSubstitution('link', this.contentItem.PrimaryUrl));
      this.substitutionsList.push(new ContentItemMessageSubstitution('description', this.contentItem.Description));
    }

    // Add all of the supplied substitutions
    if (this.substitutions) {
      this.substitutions.forEach(sub => this.substitutionsList.push(sub));
    }
  }

  // Loads the integrations the project has and stops users from picking options they have not configured
  private loadIntegrationOptions() {
    this.subIntegrations = this.sharedService.integrations.subscribe(integrations => {
      const twitterIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.Twitter);
      const facebookIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.Facebook);
      const linkedInIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.LinkedIn);
      const pinterestIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.Pinterest);
      const mediumIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.Medium);

      // Set the flags for each type of integration the user has
      if (twitterIntegrations.length > 0) { this.canAddTwitterMessages = true; this.noIntegrations = false; }
      if (facebookIntegrations.length > 0) { this.canAddFacebookMessages = true; this.noIntegrations = false; }
      if (linkedInIntegrations.length > 0) { this.canAddLinkedInMessages = true; this.noIntegrations = false; }
      if (pinterestIntegrations.length > 0) { this.canAddPinterestMessages = true; this.noIntegrations = false; }
      if (mediumIntegrations.length > 0) { this.canAddMediumMessages = true; this.noIntegrations = false; }
    });
  }


  // Load images
  private loadImages() {
    // Do not load the images if no content item has been supplied
    if (!this.contentItem) { return; }

    // Load the images for the content item
    this.imageStore.getAllFilesInFolder(`contentItem/${this.contentItem.id}`).toPromise()
      .then(response => this.images = response)
      .catch(() => { console.log('Error occurred loading images'); });
  }

  // Updates the message list with the view the user wants to see
  private redrawMessageList() {
    if (this.messages && this.messages.length > 0) {
      // Sort the messages
      this.messagesList = this.sortMessages();
    } else {
      // No messages to show
      this.messagesList = [];
    }
  }

  // Sort the list of messages based on what the user wants to see
  private sortMessages(): ShowContentItemMessageModel[] {
    const outputMessages: ShowContentItemMessageModel[] = [];

    // Sort the messages by date
    const list = this.messages.sort((one, two) => (one.SendTime > two.SendTime ? 1 : -1));

    // Loop through all the messages, update them to the display type and remove any that should not be shown
    list.forEach(item => {
      if (this.messageIsInThePast(item)) {
        // Messages is in the past
        if (!this.hideMessagesInThePast) {
          // Past messages should be shown, add it too the list
          const msg: ShowContentItemMessageModel = item as ShowContentItemMessageModel;
          msg.hasBeenSent = true;
          outputMessages.push(msg);
        }
      } else {
        // This message hasn't been sent yet
        const msg: ShowContentItemMessageModel = item as ShowContentItemMessageModel;
        msg.hasBeenSent = false;
        outputMessages.push(msg);
      }
    });

    // Return the new message list
    return outputMessages;
  }

  // Is a message in the past
  private messageIsInThePast(message: ContentItemMessageModel): boolean {
    if (!message.SendTime) { return false; }
    return message.SendTime < new Date().toISOString();
  }

  // The user wanted to edit a message
  private editMessage(message: ContentItemMessageModel) {
    switch (message.MessageType) {
      case IntegrationTypes.Twitter:
        this.editTwitterMessage(message);
        break;

      case IntegrationTypes.Facebook: {
        this.editFacebookMessage(message);
        break;
      }
    }
  }


  private handleSubstitutionAdded(sub: ContentItemMessageSubstitution) {
    // Add the sub to the list
    this.substitutionsList.push(sub);
    // Tell the parent a substitution has been added
    this.substitutionAdded.emit(sub);
  }

  private handleSubstitutionRemoved(sub: ContentItemMessageSubstitution) {
    // Remove the sub from the list
    const index = this.substitutionsList.findIndex(s => s.name === sub.name);
    if (index !== -1) {
      this.substitutionsList.splice(index, 1);
      this.substitutionRemoved.emit(sub);
    }
  }

  private handleSubstitionUpdated(sub: ContentItemMessageSubstitution) {
    // Udpate an exisiting sub
    const index = this.substitutionsList.findIndex(s => s.name === sub.name);
    if (index !== -1) {
      this.substitutionsList[index] = sub;
      this.substitutionValueUpdated.emit(sub);
    }
  }


  // --- EDITOR FUNCTIONS -----------------------------------------
  addTwitterMessage() {
    this.twitterEditor.reset();
    this.showModal('twitterModal');
  }

  addFacebookMessage() {
    console.log('show facebook editor');
    this.facebookEditor.reset();
    this.showModal('facebookModal');
  }

  editTwitterMessage(message: ContentItemMessageModel) {
    this.twitterEditor.edit(message);
    this.showModal('twitterModal');
  }

  editFacebookMessage(message: ContentItemMessageModel) {
    this.facebookEditor.edit(message);
    this.showModal('facebookModal');
  }

  // The user has cancelled an editor
  handleCancelled(modalName: string) {
    this.hideModal(modalName);
  }

  showModal(modalName: string) {
    $(`#${modalName}`).modal('show');
  }

  hideModal(modalName: string) {
    $(`#${modalName}`).modal('hide');
  }

  // The user has added a new message
  handleMessageCreated(message: ContentItemMessageModel, modalName: string) {
    // Store the new message
    console.log('Adding message')
    this.contentService.addMessage(this.contentItem.ProjectId, this.contentItem.id, message).toPromise()
      .then(
        addedMessage => {
          console.log('Message created');
          // Make sure there is an array to push the item into
          if (!this.contentItem.SocialMediaMessages) { this.contentItem.SocialMediaMessages = []; }

          // Close the editor
          this.hideModal(modalName);

          // Add the message and tell the user
          this.contentItem.SocialMediaMessages.push(addedMessage);
          this.sharedService.updateContent(this.contentItem);
          this.toast.success('Social media message added');
          this.redrawMessageList();
        })
      .catch(
        error => {
          console.log('Error creating message', error);
          this.tracking.TrackError('Error while creating social media message', error);
          this.toast.error('Unable to create social media message', 'Error');
        });
  }

  async handleMessageUpdated(message: ContentItemMessageModel, modalName: string) {
    console.log('Message updated', message);
    // Delete the old message
    await this.contentService.deleteMessage(this.contentItem.ProjectId, this.contentItem.id, message.Id).toPromise();
    // Add the new message
    const updatedMessage = await this.contentService.addMessage(this.contentItem.ProjectId, this.contentItem.id, message).toPromise();

    // Update the page
    const index = this.contentItem.SocialMediaMessages.findIndex(i => i.Id === message.Id);
    this.contentItem.SocialMediaMessages[index] = updatedMessage;
    this.sharedService.updateContent(this.contentItem);
    this.toast.success('Social media message updated');
    this.redrawMessageList();

    // Close the editor
    this.hideModal(modalName);
  }

  async handleMessageRemoved(messageId: string, modalName: string) {
    console.log('Message removed', messageId);

    // Close the editor
    this.hideModal(modalName);

    // Delete
    this.confirmDeleteMessage(messageId);
  }

  confirmDeleteMessage(messageId: string) {
    // Confirm delete
    this.alertSvc.swal({
      title: 'Delete message',
      text: 'Are you sure you want to delete this message?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      console.log('Confirmed');
      // Delete the old message
      this.contentService.deleteMessage(this.contentItem.ProjectId, this.contentItem.id, messageId).toPromise().then(() => {
        // Update the page
        const index = this.contentItem.SocialMediaMessages.findIndex(i => i.Id === messageId);
        this.contentItem.SocialMediaMessages.splice(index, 1);
        this.sharedService.updateContent(this.contentItem);
        this.toast.success('Social media message deleted');
        this.redrawMessageList();
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

// Extend the Content item message model with a boolean to show if it has already been sent
export class ShowContentItemMessageModel extends ContentItemMessageModel {
  hasBeenSent: boolean;
}
