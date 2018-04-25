import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentItemModel, ContentItemMessageModel, ContentItemService } from 'services/content-item.service';
import * as moment from 'moment';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { SweetAlertService } from 'ng2-sweetalert2';

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







  addTwitterMessage() {
    console.log('Add message', this.newMessage);
    this.isCreatingMessage = true;

    // Update the message
    this.newMessage.MessageType = IntegrationTypes.Twitter;
    this.newMessage.ImageUrl = '';
    this.newMessage.Title = '';

    // Add the message
    this.contentService.addMessage(this.contentItem.ProjectId, this.contentItem.id, this.newMessage).toPromise()
      .then(
        response => {
          console.log('Message created');
          this.contentItem.SocialMediaMessages.push(this.newMessage);
          this.sharedService.updateContent(this.contentItem);
          this.messageAdded.emit(response);
          this.toast.success('Social media message added');
          this.isCreatingMessage = false;
        })
      .catch(
        error => {
          console.log('Error creating message', error);
          this.tracking.TrackError('Error while creating social media message', error);
          this.toast.error('Unable to create social media message', 'Error');
          this.isCreatingMessage = false;
        });
  }



}
