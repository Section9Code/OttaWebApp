import { Component, OnInit, Input } from '@angular/core';
import { CimEditorCommon, ICimEditorCommon } from '../cim-editor-common';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-cim-editor-medium',
  templateUrl: './cim-editor-medium.component.html',
  styleUrls: ['./cim-editor-medium.component.css']
})
export class CimEditorMediumComponent extends CimEditorCommon implements ICimEditorCommon {
  @Input() tags: string[] = [];

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

  LoadAdditionalData(additionalData) {
    console.log('Load additional', additionalData);
    this.editorForm.get('showAllContent').patchValue(additionalData.showAllContent);
    this.editorForm.get('excerptParagraphs').patchValue(additionalData.excerptParagraphs);
    this.editorForm.get('postContent').patchValue(additionalData.footer);
    this.editorForm.get('tags').patchValue(additionalData.tags);
  }

}
