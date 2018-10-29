import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ContentItemMessageSubstitution, ContentItemMessageModel, ContentItemMessageRelativeUnitModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { RequeueReducedModel } from 'services/requeue.service';

// Access JQuery on the page
declare var $: any;

// Base class used by all editors
// It provides all the inputs and outputs shared by all editors
// It also provides the core helper functions
export abstract class CimEditorCommon {
    // Common inputs
    @Input() substitutions: ContentItemMessageSubstitution[] = [];  // The list of substitution items available to be used
    @Input() images: string[] = [];                                 // The array of images available to be used
    @Input() requeues: RequeueReducedModel[] = [];                  // The list of requeues the user can select from
    @Input() relativeDate = '';                                     // The date this item is relative too
    @Input() hideDateTimeSettings = false;                          // Allow the date selection to be hidden is not needed
    @Input() allowRequeueing = true;                                // Allow the form to show the requeueing options

    // Default input box texts
    @Input() defaultMessageText = '';
    @Input() defaultLinkText = '{link}';

    // Common outputs
    @Output() messageCreated = new EventEmitter<ContentItemMessageModel>(); // Fired when the user wants to create a message
    @Output() messageUpdated = new EventEmitter<ContentItemMessageModel>(); // Fired when the user wants to update an existing messages
    @Output() messageRemoved = new EventEmitter<string>();                  // Fired when the user wants to remove a message
    @Output() cancelled = new EventEmitter();                               // Fired when the user wants to cancel the dialog

    // The main form object all editors use
    editorForm: FormGroup;
    messageType: IntegrationTypes;

    // Flags
    createMode = true;
    editMode = false;
    isCreating = false;

    settingsEditorHasImagePicker = true;
    settingsImagePickerName = 'messageImage';

    // Default constructor, sets up the form for all editors
    constructor() {
        this.editorForm = new FormGroup({
            id: new FormControl(),
            message: new FormControl('', Validators.required),
            imageUrl: new FormControl(''),
            linkUrl: new FormControl(''),
            section: new FormControl(),
            sendDateTime: new FormControl(moment().add(5, 'minutes').toISOString()),
            sendType: new FormControl(),
            relativeSendValue: new FormControl(),
            relativeSendUnit: new FormControl(),
            relativeDate: new FormControl(),
            requeue: new FormControl(),
            requeueQueueId: new FormControl()
        }, this.validateFormSendTimes.bind(this));
    }

    // Validate the editor form to make sure the send time of the item is valid
    public validateFormSendTimes(form: FormGroup): any {
        if (this.hideDateTimeSettings) {
            // The user doesn't need the send time of the item to be validated
            return;
        }

        // Has a sent type been selected
        if (!form.controls.sendType.value) { return { noSendTypeSelected: true }; }
        if (form.controls.sendType.value !== 'relative' && form.controls.sendType.value !== 'specific') { return { invalidSendTypeSelected: true }; }

        if (form.controls.sendType.value === 'relative') {
            // Relative send time  
            form.controls.relativeSendValue.setErrors(null);
            form.controls.relativeSendUnit.setErrors(null);

            // The send value must be set
            if (!form.controls.relativeSendValue.value || form.controls.relativeSendValue.value === '') {
                form.controls.relativeSendValue.setErrors({ 'incorrect': true });
                return { noRelativeSendValue: true };
            }

            // The send unit must be set
            if (!form.controls.relativeSendUnit.value || form.controls.relativeSendUnit.value === '') {
                form.controls.relativeSendUnit.setErrors({ 'incorrect': true });
                return { noRelativeSendUnit: true };
            }

            // The calculated send date must be in the future
            const selectedDate = this.calcRelativeSendTime(+form.controls.relativeSendUnit.value, +form.controls.relativeSendValue.value, form.controls.relativeDate.value);
            if (!selectedDate.isAfter(moment())) {
                // The selected date is now or in the past
                form.controls.relativeSendValue.setErrors({ 'incorrect': true });
                form.controls.relativeSendUnit.setErrors({ 'incorrect': true });
                return { sendDateInvalid: true };
            }

        } else {
            // Specific send time
            form.controls.sendDateTime.setErrors(null);

            // A send date must be selected
            if (!form.controls.sendDateTime.value || form.controls.sendDateTime.value === '') {
                form.controls.sendDateTime.setErrors({ 'incorrect': true });
                return { noSendTime: true };
            }

            // Send must be in the future
            const selectedDate = moment(form.controls.sendDateTime.value);
            if (!selectedDate.isAfter(moment())) {
                // The selected date is now or in the past
                form.controls.sendDateTime.setErrors({ 'incorrect': true });
                return { sendDateInvalid: true };
            }
        }

        // Validate the requeue selection
        form.controls.requeueQueueId.setErrors(null);
        if (form.controls.requeue.value) {
            // The user wants to requeue this message, make sure a queue is selected
            if (!form.controls.requeueQueueId.value || form.controls.requeueQueueId.value === '') { 
                form.controls.requeueQueueId.setErrors({ 'required': true });
                return { requeueQueueIdInvalid: true };
            }
        }

        // Valid
        return null;
    }

    // The user has cancelled the editor
    public cancel() {
        this.cancelled.emit();
    }

    // Reset the editor
    public reset() {
        // Reset the form
        this.editorForm.reset();
        this.isCreating = false;
        this.createMode = true;
        this.editMode = false;
        this.editorForm.controls.message.patchValue(this.defaultMessageText);
        this.editorForm.controls.linkUrl.patchValue(this.defaultLinkText);
        this.editorForm.controls.sendDateTime.patchValue(moment().add(5, 'minutes').toISOString());
        this.editorForm.controls.requeue.patchValue(false);

        // If the user can't see the datetime settings, set the send date of the message far in the future
        if (this.hideDateTimeSettings) {
            this.editorForm.controls.sendType.patchValue('specific');
            this.editorForm.controls.sendDateTime.patchValue(moment().add(20, 'years').toISOString());
        }

        // Only show the relative options if a relative date is supplied
        if (!this.relativeDate || this.relativeDate === '') {
            // Hide the relative option
            this.editorForm.controls.sendType.patchValue('specific');
        } else {
            // The relative data is kept in the form because validation can't access component variables
            this.editorForm.controls.relativeDate.patchValue(this.relativeDate);
        }

        // Reset other parts of the component
        this.renderImagePicker();
    }

    // The user wants to edit an existing item
    public edit(message: ContentItemMessageModel) {
        this.reset();
        this.createMode = false;
        this.editMode = true;

        // Update the form
        this.editorForm.controls.id.patchValue(message.Id);
        this.editorForm.controls.message.patchValue(message.Message);
        this.editorForm.controls.imageUrl.patchValue(message.ImageUrl);
        this.editorForm.controls.linkUrl.patchValue(message.LinkUrl);
        this.editorForm.controls.section.patchValue(message.RemoteSystemSectionId);
        this.editorForm.controls.requeue.patchValue(message.Requeue);
        this.editorForm.controls.requeueQueueId.patchValue(message.RequeueToQueueId);

        if (message.IsRelative) {
            // Relative time
            this.editorForm.controls.sendType.patchValue('relative');
            this.editorForm.controls.relativeSendUnit.patchValue(message.RelativeSendUnit.toString());
            this.editorForm.controls.relativeSendValue.patchValue(message.RelativeSendValue);
        } else {
            // Specific time
            this.editorForm.controls.sendType.patchValue('specific');
            this.editorForm.controls.sendDateTime.patchValue(message.SendTime);
        }

        // Load any additional data
        this.LoadAdditionalData(message.AdditionalData);
    }

    public LoadAdditionalData(additionalData) {
        // This is replaced in components that need to load additional data
    }

    // Renders the image picker widget on the form
    public renderImagePicker() {
        if (!this.settingsEditorHasImagePicker) { return; }

        setTimeout(() => {
            // HACK: You need to wait a few moments for the form to render before calling the function to show the image picker
            $(`#${this.settingsImagePickerName}`).imagepicker();
            $(`#${this.settingsImagePickerName}`).change(() => { this.imageChanged($(`#${this.settingsImagePickerName}`).val()); });
        }, 300);
    }

    // Called every time the users changes the image they have selected
    public imageChanged(imageUrl: string) {
        if (!imageUrl) {
            this.editorForm.controls.imageUrl.patchValue('');
        } else {
            this.editorForm.controls.imageUrl.patchValue(imageUrl);
        }
    }

    // Add a new message
    public addMessage() {
        // Get the message from the form
        this.isCreating = true;
        const newMessage = this.GetMessageFromForm();

        // Tell the parent a new message item has been created
        this.messageCreated.emit(newMessage);
    }

    // The user wants to update the current message
    public updateMessage() {
        // Update the message object
        this.isCreating = true;
        const message = this.GetMessageFromForm();
        message.Id = this.editorForm.controls.id.value;

        // Tell the parent the message has been updated
        this.messageUpdated.emit(message);
    }

    // The user wants to delete the current message
    public deleteMessage() {
        this.messageRemoved.emit(this.editorForm.controls.id.value);
    }

    // Read the form and turn it into a content message item
    public GetMessageFromForm(): ContentItemMessageModel {
        const newMessage = new ContentItemMessageModel();
        newMessage.MessageType = this.messageType;
        newMessage.Message = this.editorForm.controls.message.value;
        newMessage.ImageUrl = this.editorForm.controls.imageUrl.value;
        newMessage.LinkUrl = this.editorForm.controls.linkUrl.value;
        newMessage.RemoteSystemSectionId = this.editorForm.controls.section.value;
        newMessage.Requeue = this.editorForm.controls.requeue.value;
        newMessage.RequeueToQueueId = this.editorForm.controls.requeueQueueId.value;

        if (this.editorForm.controls.sendType.value === 'relative') {
            // Relative send
            newMessage.IsRelative = true;
            newMessage.RelativeSendUnit = +this.editorForm.controls.relativeSendUnit.value;
            newMessage.RelativeSendValue = +this.editorForm.controls.relativeSendValue.value;
            newMessage.SendTime = this.calcRelativeSendTime(newMessage.RelativeSendUnit, newMessage.RelativeSendValue, this.relativeDate).toISOString();
        } else {
            // Specific send
            newMessage.IsRelative = false;
            newMessage.SendTime = this.editorForm.controls.sendDateTime.value;
        }

        // Add any additional data
        newMessage.AdditionalData = this.SaveAdditionalData();

        return newMessage;
    }

    // Can be replaced in child controls to add additional data to an item
    public SaveAdditionalData(): Object {
        return null;
    }

    // Do the substitutions for any piece of text
    public performSubstitutions(input: string): string {
        if (!input) { return ''; }

        let output = input;
        this.substitutions.forEach(sub => {
            const target = `{${sub.name}}`;
            output = output.replace(target, sub.value);
        });

        return output;
    }

    // Calculate the time relative to a specific value
    public calcRelativeSendTime(unit: ContentItemMessageRelativeUnitModel, value: number, deadlineIsoDate: string): moment.Moment {
        let sendTime: moment.Moment;
        sendTime = moment(deadlineIsoDate);

        switch (unit) {
            case ContentItemMessageRelativeUnitModel.Minutes:
                sendTime = sendTime.add(value, 'minutes');
                break;
            case ContentItemMessageRelativeUnitModel.Hours:
                sendTime = sendTime.add(value, 'hours');
                break;
            case ContentItemMessageRelativeUnitModel.Days:
                sendTime = sendTime.add(value, 'days');
                break;
            case ContentItemMessageRelativeUnitModel.Weeks:
                sendTime = sendTime.add(value, 'weeks');
                break;
            case ContentItemMessageRelativeUnitModel.Months:
                sendTime = sendTime.add(value, 'months');
                break;
            default:
                break;
        }

        // Return the relative value
        return sendTime;
    }
}

