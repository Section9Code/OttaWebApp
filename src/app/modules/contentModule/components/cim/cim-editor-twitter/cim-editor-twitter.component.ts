import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ContentItemMessageSubstitution, ContentItemMessageModel, ContentItemMessageRelativeUnitModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { ICimEditorCommon, CimEditorCommon } from '../cim-editor-common';

declare var $: any;

@Component({
    selector: 'app-cim-editor-twitter',
    templateUrl: './cim-editor-twitter.component.html',
    styleUrls: ['./cim-editor-twitter.component.css']
})
export class CimEditorTwitterComponent extends CimEditorCommon implements ICimEditorCommon {
    // For calculating message length remaining
    maxCharacters = 280;
    charactersRemaining: number = this.maxCharacters;

    constructor() {
        super();
        this.messageType = IntegrationTypes.Twitter;
        this.settingsEditorHasImagePicker = true;
        this.settingsImagePickerName = 'twitterImagePicker';
    }

    reset() {
        super.reset();
        this.updateCharacterCounter();
    }

    edit(message: ContentItemMessageModel) {
        super.edit(message);
        this.updateCharacterCounter();
    }

    // Updates the character count of the message box
    updateCharacterCounter() {
        let text = this.editorForm.controls.message.value;
        text = this.performSubstitutions(text);
        this.charactersRemaining = this.maxCharacters - text.length;
    }
}


