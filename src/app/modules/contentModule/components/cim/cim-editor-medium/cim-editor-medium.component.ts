import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CimEditorCommon } from '../cim-editor-common';
import { ICimEditorCommon } from '../ICimEditorCommon';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { FormControl, AbstractControl } from '@angular/forms';
import { SubSuggestComponent } from '../sub-suggest/sub-suggest.component';

@Component({
  selector: 'app-cim-editor-medium',
  templateUrl: './cim-editor-medium.component.html',
  styleUrls: ['./cim-editor-medium.component.css']
})
export class CimEditorMediumComponent extends CimEditorCommon implements ICimEditorCommon {
  @Input() tags: string[] = [];

  @ViewChild('MessageSuggest') messageSuggest: SubSuggestComponent;
  @ViewChild('ContentSuggest') contentSuggest: SubSuggestComponent;

  constructor() {
    super();
    this.messageType = IntegrationTypes.Medium;
    this.settingsEditorHasImagePicker = false;

    // Add on additional form controls
    this.editorForm.addControl('showAllContent', new FormControl(true));
    this.editorForm.addControl('excerptParagraphs', new FormControl(3));
    this.editorForm.addControl('postContent', new FormControl(''));
    this.editorForm.addControl('tags', new FormControl(''));
  }

  reset() {
    super.reset();
    this.editorForm.get('message').patchValue('This post was originally posted on {link}');
    this.editorForm.get('showAllContent').patchValue(true);
    this.editorForm.get('excerptParagraphs').patchValue(1);
  }

  // Create the object to hold the additional data
  SaveAdditionalData(): Object {
    return {
      showAllContent: this.editorForm.get('showAllContent').value,
      excerptParagraphs: this.editorForm.get('excerptParagraphs').value,
      footer: this.editorForm.get('postContent').value,
      tags: this.editorForm.get('tags').value
    };
  }

  // Load additional data from the message when it is edited
  LoadAdditionalData(additionalData) {
    console.log('Load additional', additionalData);
    this.editorForm.get('showAllContent').patchValue(additionalData.showAllContent);
    this.editorForm.get('excerptParagraphs').patchValue(additionalData.excerptParagraphs);
    this.editorForm.get('postContent').patchValue(additionalData.footer);
    this.editorForm.get('tags').patchValue(additionalData.tags);
  }

  suggestionKeypress(event: KeyboardEvent, control: SubSuggestComponent) {
    control.keyPress(event);
  }

  suggestionUpdate(text: string, control: AbstractControl) {
    control.patchValue(text);
  }

}
