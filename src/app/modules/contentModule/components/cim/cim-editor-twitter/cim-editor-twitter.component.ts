import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ContentItemMessageSubstitution, ContentItemMessageModel, ContentItemMessageRelativeUnitModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';

declare var $: any;


export class CimEditorCommon {
    // Common inputs
    @Input() substitutions: ContentItemMessageSubstitution[] = [];  // The list of substitution items available to be used
    @Input() images: string[] = [];                                 // The array of images available to be used
    @Input() relativeDate = '';                                     // The date this item is relative too

    // Common outputs
    @Output() messageCreated = new EventEmitter<ContentItemMessageModel>(); // Fired when the user wants to create a message
    @Output() messageUpdated = new EventEmitter<ContentItemMessageModel>(); // Fired when the user wants to update an existing messages
    @Output() messageRemoved = new EventEmitter<string>();                  // Fired when the user wants to remove a message
    @Output() cancelled = new EventEmitter();                               // Fired when the user wants to cancel the dialog

    // Flags
    createMode = true;
    editMode = false;
    isCreating = false;

    // The user has cancelled the editor
    cancel() {
        this.cancelled.emit();
    }

    // Do the substitutions for any piece of text
    performSubstitutions(input: string): string {
        if (!input) { return ''; }

        let output = input;
        this.substitutions.forEach(sub => {
            const target = `{${sub.name}}`;
            output = output.replace(target, sub.value);
        });

        return output;
    }

    // Calculate the time relative to a specific value
    calcRelativeSendTime(unit: ContentItemMessageRelativeUnitModel, value: number, deadlineIsoDate: string): moment.Moment {
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

export interface ICimEditorCommon {
    // The editor must reset itself
    reset();

    // The user wants to edit an existing message
    edit(message: ContentItemMessageModel);
}
















@Component({
    selector: 'app-cim-editor-twitter',
    templateUrl: './cim-editor-twitter.component.html',
    styleUrls: ['./cim-editor-twitter.component.css']
})
export class CimEditorTwitterComponent extends CimEditorCommon implements OnInit, ICimEditorCommon {
    editorForm: FormGroup;

    // For calculating message length remaining
    maxCharacters = 280;
    charactersRemaining: number = this.maxCharacters;

    constructor() {
        super();

        this.editorForm = new FormGroup({
            id: new FormControl(),
            message: new FormControl('', Validators.required),
            imageUrl: new FormControl(''),
            sendDateTime: new FormControl(moment().add(5, 'minutes').toISOString()),
            sendType: new FormControl(),
            relativeSendValue: new FormControl(),
            relativeSendUnit: new FormControl(),
            relativeDate: new FormControl()
        }, this.validateFormSendTimes);
    }

    ngOnInit() {
    }

    validateFormSendTimes(form: FormGroup): any {
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
            const selectedDate = super.calcRelativeSendTime(+form.controls.relativeSendUnit.value, +form.controls.relativeSendValue.value, form.controls.relativeDate.value);
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

        // Valid
        return null;
    }

    // Reset the editor
    public reset() {
        // Reset the form
        this.editorForm.reset();
        this.isCreating = false;
        this.createMode = true;
        this.editMode = false;
        this.editorForm.controls.sendDateTime.patchValue(moment().add(5, 'minutes').toISOString());

        // Only show the relative options if a relative date is supplied
        if (!this.relativeDate || this.relativeDate === '') {
            // Hide the relative option
            this.editorForm.controls.sendType.patchValue('specific');
        } else {
            // The relative data is kept in the form because validation can't access component variables
            this.editorForm.controls.relativeDate.patchValue(this.relativeDate);
        }

        // Reset other parts of the component
        this.editorTextChanged();
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

        // Update the char counter
        this.editorTextChanged();
    }

    // Renders the image picker widget on the form
    renderImagePicker() {
        setTimeout(() => {
            // HACK: You need to wait a few moments for the form to render before calling the function to show the image picker
            $('#messageImage').imagepicker();
            $('#messageImage').change(() => { this.imageChanged($('#messageImage').val()); });
        }, 300);
    }

    // Called every time the users changes the image they have selected
    imageChanged(imageUrl: string) {
        if (!imageUrl) {
            this.editorForm.controls.imageUrl.patchValue('');
        } else {
            this.editorForm.controls.imageUrl.patchValue(imageUrl);
        }
    }

    // Updates the character count of the message box
    editorTextChanged() {
        let text = this.editorForm.controls.message.value;
        text = this.performSubstitutions(text);
        this.charactersRemaining = this.maxCharacters - text.length;
    }

    // Add a new message
    addMessage() {
        // Get the message from the form
        this.isCreating = true;
        const newMessage = this.GetMessageFromForm();

        // Tell the parent a new message item has been created
        this.messageCreated.emit(newMessage);
    }

    updateMessage() {
      // Update the message object
      this.isCreating = true;
      const message = this.GetMessageFromForm();
      message.Id = this.editorForm.controls.id.value;

      // Tell the parent the message has been updated
      this.messageUpdated.emit(message);
    }

    deleteMessage() {
      this.messageRemoved.emit(this.editorForm.controls.id.value);
    }

    GetMessageFromForm(): ContentItemMessageModel {
      const newMessage = new ContentItemMessageModel();
      newMessage.MessageType = IntegrationTypes.Twitter;
      newMessage.Message = this.editorForm.controls.message.value;
      newMessage.ImageUrl = this.editorForm.controls.imageUrl.value;

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

      return newMessage;
    }
}


