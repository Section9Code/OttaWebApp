import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CimEditorCommon } from '../cim-editor-common';
import { ICimEditorCommon } from '../ICimEditorCommon';
import { IntegrationTypes, PinterestProjectIntegrationModel } from 'services/ContentProjectIntegration.service';
import { Validators, AbstractControl } from '@angular/forms';
import { SubSuggestComponent } from '../sub-suggest/sub-suggest.component';

@Component({
  selector: 'app-cim-editor-pinterest',
  templateUrl: './cim-editor-pinterest.component.html',
  styleUrls: ['./cim-editor-pinterest.component.css']
})
export class CimEditorPinterestComponent extends CimEditorCommon implements ICimEditorCommon {
  @Input() pinterestIntegration = new PinterestProjectIntegrationModel();

  @ViewChild('MessageSuggest') messageSuggest: SubSuggestComponent;
  @ViewChild('LinkSuggest') linkSuggest: SubSuggestComponent;

  constructor() {
    super();
    this.messageType = IntegrationTypes.Pinterest;
    this.settingsEditorHasImagePicker = true;
    this.settingsImagePickerName = 'pinterestImagePicker';

    // Make sure the section is required
    this.editorForm.get('imageUrl').setValidators(Validators.required);
    this.editorForm.get('section').setValidators(Validators.required);
  }

  suggestionKeypress(event: KeyboardEvent, control: SubSuggestComponent) {
    control.keyPress(event);
  }

  suggestionUpdate(text: string, control: AbstractControl) {
    control.patchValue(text);
  }


}
