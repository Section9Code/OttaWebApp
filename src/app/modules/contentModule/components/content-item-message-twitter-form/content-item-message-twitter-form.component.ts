import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentItemModel, ContentItemMessageModel, ContentItemService, ContentItemMessageRelativeUnitModel } from 'services/content-item.service';
import * as moment from 'moment';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { SweetAlertService } from 'ng2-sweetalert2';
import { send } from 'q';

@Component({
  selector: 'otta-content-item-message-twitter-form',
  templateUrl: './content-item-message-twitter-form.component.html',
  styleUrls: ['./content-item-message-twitter-form.component.css']
})
export class ContentItemMessageTwitterFormComponent {
  // Component inputs/outputs
  @Input() contentItem: ContentItemModel = new ContentItemModel();
  @Output() messageAdded = new EventEmitter();

  // Variables
  isCreatingMessage = false;
  showTimeOptions = true;
  showAbsoluteForm = false;
  showRelativeForm = false;
  sendUnit: string;
  buttonText = 'Add message';


  // A new message for the user to fill in
  newMessage = new ContentItemMessageModel();

  // Datepicker settings
  datePickerMinDate = moment();

  constructor(
    private sharedService: ContentProjectShareService,
    private contentService: ContentItemService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private alertSvc: SweetAlertService) {
  }

  showAbsoluteHandler() {
    this.newMessage.IsRelative = false;
    this.showTimeOptions = false;
    this.showAbsoluteForm = true;
  }

  showRelativeHandler() {
    this.newMessage.IsRelative = true;
    this.newMessage.RelativeSendValue = 5;
    this.newMessage.RelativeSendUnit = ContentItemMessageRelativeUnitModel.Minutes;
    this.showTimeOptions = false;
    this.showRelativeForm = true;
  }

  // Adds a twitter message to be sent at a specific time
  addTwitterMessage() {
    console.log('Add specific twitter message', this.newMessage);
    this.isCreatingMessage = true;

    // Update the message
    this.newMessage.MessageType = IntegrationTypes.Twitter;
    this.newMessage.ImageUrl = '';
    this.newMessage.Title = '';

    // Add the message
    this.save();
  }

  // Adds a twitter message to be sent at a time relative to the publish of the article
  addRelativeTwitterMessage() {
    console.log('Add relative twitter message', this.newMessage);
    this.isCreatingMessage = true;

    // Update the message
    this.newMessage.MessageType = IntegrationTypes.Twitter;
    this.newMessage.ImageUrl = '';
    this.newMessage.Title = '';

    // Calculate the send time
    this.newMessage.RelativeSendUnit = +this.sendUnit;
    let sendTime: moment.Moment;
    sendTime = moment(this.contentItem.DeadLine);
    console.log('Relative unit', this.newMessage.RelativeSendUnit)
    switch (this.newMessage.RelativeSendUnit) {
      case ContentItemMessageRelativeUnitModel.Minutes:
        console.log('Set send time - minutes');
        sendTime = sendTime.add(this.newMessage.RelativeSendValue, 'minutes');
        break;
      case ContentItemMessageRelativeUnitModel.Hours:
        console.log('Set send time - hours');
        sendTime = sendTime.add(this.newMessage.RelativeSendValue, 'hours');
        break;
      case ContentItemMessageRelativeUnitModel.Days:
        console.log('Set send time - days');
        sendTime = sendTime.add(this.newMessage.RelativeSendValue, 'days');
        break;
      case ContentItemMessageRelativeUnitModel.Weeks:
        console.log('Set send time - weeks');
        sendTime = sendTime.add(this.newMessage.RelativeSendValue, 'weeks');
        break;
      case ContentItemMessageRelativeUnitModel.Months:
        console.log('Set send time - months');
        sendTime = sendTime.add(this.newMessage.RelativeSendValue, 'months');
        break;
      default:
        console.error('Set send time not set correctly');
        break;
    }

    // Set the send time
    this.newMessage.SendTime = sendTime.toISOString();

    // Add
    this.save();
  }

  save() {
    if (!this.newMessage.Id || this.newMessage.Id === '') {
      // Add the message
      this.addMessageToSystem();
    }
    else {
      // Update an existing message
      this.updateMessageInSystem();
    }
  }

  addMessageToSystem() {
    console.log('Add message to system');
    this.contentService.addMessage(this.contentItem.ProjectId, this.contentItem.id, this.newMessage).toPromise()
      .then(
        addedMessage => {
          console.log('Message created');
          this.contentItem.SocialMediaMessages.push(addedMessage);
          this.sharedService.updateContent(this.contentItem);
          this.messageAdded.emit(addedMessage);
          this.toast.success('Social media message added');
          this.isCreatingMessage = false;
          this.resetForm();
        })
      .catch(
        error => {
          console.log('Error creating message', error);
          this.tracking.TrackError('Error while creating social media message', error);
          this.toast.error('Unable to create social media message', 'Error');
          this.isCreatingMessage = false;
          this.resetForm();
        });
  }

  updateMessageInSystem() {
    console.log('Update message in system');

    // Delete the old message
    this.contentService.deleteMessage(this.contentItem.ProjectId, this.contentItem.id, this.newMessage.Id).toPromise()
      .then(deleteSuccess => {
        // Remove the message from the item
        var index = this.contentItem.SocialMediaMessages.findIndex(m => m.Id === this.newMessage.Id);
        this.contentItem.SocialMediaMessages.splice(index, 1);

        // Add the new message
        this.newMessage.Id = '';
        this.contentService.addMessage(this.contentItem.ProjectId, this.contentItem.id, this.newMessage).toPromise()
          .then(addedMessage => {
            // Message added successfully
            this.contentItem.SocialMediaMessages.push(addedMessage);
            this.sharedService.updateContent(this.contentItem);
            this.messageAdded.emit(addedMessage);
            this.toast.success('Message updated');
            this.isCreatingMessage = false;
            this.resetForm();
          })
          .catch(addError => {
            this.toast.error('Unable to update the message');
            this.tracking.TrackError('Error occurred adding a new message', addError);
            this.isCreatingMessage = false;
          });
      })
      .catch(deleteError => {
        this.toast.error('Unable to update the message');
        this.tracking.TrackError('Error occurred adding a new message', deleteError);
        this.isCreatingMessage = false;
      });
  }

  // Reset the form to is new state
  resetForm() {
    this.sendUnit = '0';
    this.buttonText = 'Add message';
    this.newMessage = new ContentItemMessageModel();
    this.showTimeOptions = true;
    this.showAbsoluteForm = false;
    this.showRelativeForm = false;
  }

  // Called from outside the component if the user wants to edit a message
  editMessage(message: ContentItemMessageModel) {
    this.newMessage = message;

    this.showTimeOptions = false;
    this.showRelativeForm = false;
    this.showAbsoluteForm = false;
    this.buttonText = 'Update message';

    if (message.IsRelative) {
      this.showRelativeForm = true;
      this.sendUnit = this.newMessage.RelativeSendUnit.toString();
    }
    else {
      this.showAbsoluteForm = true;
    }
  }
}
