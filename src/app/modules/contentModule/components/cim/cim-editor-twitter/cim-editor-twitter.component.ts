import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ContentItemMessageSubstitution, ContentItemMessageModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

declare var $: any;


export class CimEditorCommon {
    // Common inputs
    @Input() substitutions: ContentItemMessageSubstitution[] = [];
    @Input() images: string[] = [];

    // Common outputs
    @Output() messageAdded = new EventEmitter<ContentItemMessageModel>();
    @Output() messageUpdated = new EventEmitter<ContentItemMessageModel>();
    @Output() messageRemoved = new EventEmitter<string>();
    @Output() cancelled = new EventEmitter();

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
export class CimEditorTwitterComponent extends CimEditorCommon implements OnInit, AfterViewInit, ICimEditorCommon {
    editorForm: FormGroup;

    // For calculating message length remaining
    maxCharacters = 280;
    charactersRemaining: number = this.maxCharacters;

    constructor() {
        super();

        this.editorForm = new FormGroup({
            message: new FormControl('', Validators.required),
            imageUrl: new FormControl(''),
            sendTime: new FormControl(moment().add(5, 'minutes').toISOString()),
            isRelative: new FormControl(),
            relativeSendValue: new FormControl(),
            relativeSendUnit: new FormControl
        });
    }

    ngOnInit() {
      
    }

    ngAfterViewInit() {
      
    }

    // Reset the editor
    public reset() {
        this.editorForm.reset();
        this.editorTextChanged();
        this.renderImagePicker();
    }

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
}


