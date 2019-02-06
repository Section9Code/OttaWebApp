import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { ContentItemMessageSubstitution, ContentItemMessageModel, ContentItemMessageRelativeUnitModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { CimEditorCommon } from '../cim-editor-common';
import { ICimEditorCommon } from '../ICimEditorCommon';
import { SubSuggestComponent } from '../sub-suggest/sub-suggest.component';

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

    @ViewChild('MessageSuggest') messageSuggest: SubSuggestComponent;

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

    suggestionKeypress(event: KeyboardEvent) {
        this.messageSuggest.keyPress(event);
    }

    suggestionUpdate(text: string) {
        this.editorForm.controls.message.patchValue(text);
    }
}


