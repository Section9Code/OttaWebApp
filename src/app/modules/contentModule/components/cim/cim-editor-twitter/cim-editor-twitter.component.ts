import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ContentItemMessageSubstitution, ContentItemMessageModel, ContentItemMessageRelativeUnitModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';

declare var $: any;


export class CimEditorCommon {
    // Common inputs
    @Input() substitutions: ContentItemMessageSubstitution[] = [];
    @Input() images: string[] = [];

    // Common outputs
    @Output() messageCreated = new EventEmitter<ContentItemMessageModel>();
    @Output() messageUpdated = new EventEmitter<ContentItemMessageModel>();
    @Output() messageRemoved = new EventEmitter<string>();
    @Output() cancelled = new EventEmitter();

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
                console.log('Set send time - minutes');
                sendTime = sendTime.add(value, 'minutes');
                break;
            case ContentItemMessageRelativeUnitModel.Hours:
                console.log('Set send time - hours');
                sendTime = sendTime.add(value, 'hours');
                break;
            case ContentItemMessageRelativeUnitModel.Days:
                console.log('Set send time - days');
                sendTime = sendTime.add(value, 'days');
                break;
            case ContentItemMessageRelativeUnitModel.Weeks:
                console.log('Set send time - weeks');
                sendTime = sendTime.add(value, 'weeks');
                break;
            case ContentItemMessageRelativeUnitModel.Months:
                console.log('Set send time - months');
                sendTime = sendTime.add(value, 'months');
                break;
            default:
                console.error('Set send time not set correctly');
                break;
        }

        // Return the relative value
        return sendTime;
    }

}

export interface ICimEditorCommon {
    // The editor must reset itself
    reset();
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
            message: new FormControl('', Validators.required),
            imageUrl: new FormControl(''),
            sendDateTime: new FormControl(moment().add(5, 'minutes').toISOString()),
            sendType: new FormControl(),
            relativeSendValue: new FormControl(),
            relativeSendUnit: new FormControl()
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
            if (!form.controls.relativeSendValue.value || form.controls.relativeSendValue.value === '') { return { noRelativeSendValue: true }; }
            if (!form.controls.relativeSendUnit.value || form.controls.relativeSendUnit.value === '') { return { noRelativeSendUnit: true }; }
        } else {
            // Specific send time
            if (!form.controls.sendDateTime.value || form.controls.sendDateTime.value === '') { return { noSendTime: true }; }
        }

        // Valid
        return null;
    }

    // Reset the editor
    public reset() {
        // Reset the form
        this.editorForm.reset();
        this.createMode = true;
        this.editorForm.controls.sendDateTime.patchValue(moment().add(5, 'minutes').toISOString());

        // Reset other parts of the component
        this.editorTextChanged();
        this.renderImagePicker();
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
        const newMessage = new ContentItemMessageModel();
        newMessage.MessageType = IntegrationTypes.Twitter;
        newMessage.Message = this.editorForm.controls.message.value;
        newMessage.ImageUrl = this.editorForm.controls.imageUrl.value;

        if (this.editorForm.controls.sendType.value === 'relative') {
            // Relative send
            newMessage.IsRelative = true;
            newMessage.RelativeSendUnit = this.editorForm.controls.relativeSendUnit.value;
            newMessage.RelativeSendValue = this.editorForm.controls.relativeSendValue.value;
            newMessage.SendTime = this.calcRelativeSendTime(newMessage.RelativeSendUnit, newMessage.RelativeSendValue, moment().toISOString()).toISOString();
        } else {
            // Specific send
            newMessage.IsRelative = false;
            newMessage.SendTime = this.editorForm.controls.sendDateTime.value;
        }

        // Tell the parent a new message item has been created
        this.messageCreated.emit(newMessage);
    }
}


