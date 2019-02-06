import { Component, OnInit, ViewChild } from '@angular/core';
import { CimEditorCommon } from '../cim-editor-common';
import { ICimEditorCommon } from '../ICimEditorCommon';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { SubSuggestComponent } from '../sub-suggest/sub-suggest.component';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-cim-editor-linkedin',
  templateUrl: './cim-editor-linkedin.component.html',
  styleUrls: ['./cim-editor-linkedin.component.css']
})
export class CimEditorLinkedinComponent extends CimEditorCommon implements ICimEditorCommon {

  @ViewChild('MessageSuggest') messageSuggest: SubSuggestComponent;
  @ViewChild('LinkSuggest') linkSuggest: SubSuggestComponent;

  constructor() {
    super();
    this.messageType = IntegrationTypes.LinkedIn;
    this.settingsEditorHasImagePicker = true;
    this.settingsImagePickerName = 'linkedinImagePicker';
  }

  suggestionKeypress(event: KeyboardEvent, control: SubSuggestComponent) {
    control.keyPress(event);
  }

  suggestionUpdate(text: string, control: AbstractControl) {
    control.patchValue(text);
  }

}
