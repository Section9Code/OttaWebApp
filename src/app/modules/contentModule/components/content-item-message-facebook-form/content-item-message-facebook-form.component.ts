import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IContentItemMessageForm } from '../IContentItemMessageForm';
import { ContentItemMessageModel, ContentItemModel, ContentItemService, ContentItemMessageRelativeUnitModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ProjectIntegrationModel, FacebookProjectIntegrationModel, IntegrationTypes, ContentProjectIntegrationService } from 'services/ContentProjectIntegration.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { Subscription } from 'rxjs/Subscription';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-content-item-message-facebook-form',
  templateUrl: './content-item-message-facebook-form.component.html',
  styleUrls: ['./content-item-message-facebook-form.component.css']
})
export class ContentItemMessageFacebookFormComponent implements OnInit, IContentItemMessageForm {
  // Component inputs/outputs
  @Input() contentItem: ContentItemModel = new ContentItemModel();
  @Input() images: string[] = [];
  @Output() messageAdded = new EventEmitter();

  // The form the user fills in on the page
  facebookForm = new FormGroup({
    message: new FormControl('', Validators.required),
    linkUrl: new FormControl(''),
    facebookPage: new FormControl('', Validators.required),
    sendType: new FormControl(''),
    sendDateTime: new FormControl(''),
    relativeUnit: new FormControl(''),
    relativeAmount: new FormControl('')
  }, this.validateForm);

  // Integration being used
  facebookIntegration = new FacebookProjectIntegrationModel();

  // Flags
  isCreating = false;


  constructor(
    private sharedService: ContentProjectShareService,
    private integrationService: ContentProjectIntegrationService,
    private contentService: ContentItemService,
    private tracking: MixpanelService,
    private toast: ToastsManager) { }

  // Validates the form to make sure it is valid
  validateForm(group: FormGroup) {
    // // Clear errors
    group.controls.sendDateTime.setErrors(null);
    group.controls.relativeUnit.setErrors(null);
    group.controls.relativeAmount.setErrors(null);

    if (group.controls.sendType.value === 'specific') {
      // Specific send time
      if (!group.controls.sendDateTime.value) {
        group.controls.sendDateTime.setErrors({ isRequired: true });
      }
    } else {
      // Relative send time
      if (!group.controls.relativeUnit.value) {
        group.controls.relativeUnit.setErrors({ isRequired: true });
      }

      if (!group.controls.relativeAmount.value) {
        group.controls.relativeAmount.setErrors({ isRequired: true });
      }
    }

    return null;
  }

  ngOnInit(): void {
    // Load the users facebook integrations
    this.integrationService.facebookGetAllIntegrations(this.contentItem.ProjectId).toPromise()
      .then(response => {
        console.log('Integrations', response);
        if (response && response.length > 0) {
          // Save the details of the users facebook integration
          this.facebookIntegration = response[0];
        }
      })
      .catch(() => {
        console.log('Error loading project integrations');
      });
  }

  resetForm() {
    console.log('Facebook form: Reset');
    this.facebookForm.reset();
  }

  editMessage(message: ContentItemMessageModel) {
    console.log('Facebook form: Edit message', message);
  }

  createMessage() {
    console.log('Create Facebook Message');
    if (this.facebookForm.valid) {
      this.isCreating = true;

      // Create the message object
      let msg = new ContentItemMessageModel();
      msg.Title = '';
      msg.Message = this.facebookForm.controls.message.value;
      msg.MessageType = IntegrationTypes.Facebook;
      msg.RemoteSystemSectionId = this.facebookForm.controls.facebookPage.value;

      // Set the send time of the message
      if (this.facebookForm.controls.sendType.value === 'specific') {
        msg.IsRelative = false;
        msg.SendTime = this.facebookForm.controls.sendDateTime.value;
      } else {
        msg.IsRelative = true;
        msg.RelativeSendUnit = +this.facebookForm.controls.relativeUnit.value;
        msg.RelativeSendValue = +this.facebookForm.controls.relativeAmount.value;
        msg.SendTime = this.CalcRelativeSendTimeForMessage(msg.RelativeSendUnit, msg.RelativeSendValue);
      }

      // Save the message
      this.save(msg);
    }
  }

  CalcRelativeSendTimeForMessage(relativeSendUnit: ContentItemMessageRelativeUnitModel, relativeSendValue: number): string {
    // Set the deadline of the content item
    let sendTime: moment.Moment;
    sendTime = moment(this.contentItem.DeadLine);

    console.log('Relative unit', relativeSendUnit)
    switch (relativeSendUnit) {
      case ContentItemMessageRelativeUnitModel.Minutes:
        console.log('Set send time - minutes');
        sendTime = sendTime.add(relativeSendValue, 'minutes');
        break;
      case ContentItemMessageRelativeUnitModel.Hours:
        console.log('Set send time - hours');
        sendTime = sendTime.add(relativeSendValue, 'hours');
        break;
      case ContentItemMessageRelativeUnitModel.Days:
        console.log('Set send time - days');
        sendTime = sendTime.add(relativeSendValue, 'days');
        break;
      case ContentItemMessageRelativeUnitModel.Weeks:
        console.log('Set send time - weeks');
        sendTime = sendTime.add(relativeSendValue, 'weeks');
        break;
      case ContentItemMessageRelativeUnitModel.Months:
        console.log('Set send time - months');
        sendTime = sendTime.add(relativeSendValue, 'months');
        break;
      default:
        console.error('Set send time not set correctly');
        break;
    }

    // Set the send time
    return sendTime.toISOString();
  }

  save(msg: ContentItemMessageModel) {
    if (!msg.Id || msg.Id === '') {
      // Add the message
      this.addMessageToSystem(msg);
    } else {
      // Update an existing message
      //this.updateMessageInSystem();
    }
  }

  addMessageToSystem(message: ContentItemMessageModel) {
    this.contentService.addMessage(this.contentItem.ProjectId, this.contentItem.id, message).toPromise()
      .then(
        addedMessage => {
          console.log('Message created');
          // Make sure there is an array to push the item into
          if (!this.contentItem.SocialMediaMessages) {
            this.contentItem.SocialMediaMessages = [];
          }

          // Add the message to the content item
          this.contentItem.SocialMediaMessages.push(addedMessage);
          this.sharedService.updateContent(this.contentItem);
          //  tell the user
          this.messageAdded.emit(addedMessage);
          this.toast.success('Social media message added');
          this.isCreating = false;
          this.resetForm();
        })
      .catch(
        error => {
          console.log('Error creating message', error);
          this.tracking.TrackError('Error while creating social media message', error);
          this.toast.error('Unable to create social media message', 'Error');
          this.isCreating = false;
          this.resetForm();
        });
  }
}
