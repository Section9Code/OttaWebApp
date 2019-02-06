import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CimEditorCommon } from '../cim-editor-common';
import { ICimEditorCommon } from '../ICimEditorCommon';
import { IntegrationTypes, FacebookProjectIntegrationModel } from 'services/ContentProjectIntegration.service';
import { ContentItemMessageModel } from 'services/content-item.service';
import { Validators, AbstractControl } from '@angular/forms';
import { SubSuggestComponent } from '../sub-suggest/sub-suggest.component';

@Component({
  selector: 'app-cim-editor-facebook',
  templateUrl: './cim-editor-facebook.component.html',
  styleUrls: ['./cim-editor-facebook.component.css']
})
export class CimEditorFacebookComponent extends CimEditorCommon implements ICimEditorCommon {
  // The facebook integration to use
  @Input() facebookIntegration: FacebookProjectIntegrationModel;

  // Hold the list of sections the user can post to
  facebookSections = [];

  // Settings
  settingsEditorHasImagePicker = false;

  @ViewChild('MessageSuggest') messageSuggest: SubSuggestComponent;
  @ViewChild('LinkSuggest') linkSuggest: SubSuggestComponent;

  constructor() {
    super();
    this.messageType = IntegrationTypes.Facebook;

    // Make sure the section is required
    this.editorForm.get('section').setValidators(Validators.required);
  }

  reset() {
    super.reset();
    this.getSections();
  }

  // Get the sections the user can use from the integration with facebook
  getSections(): any {
    console.log('FCEditor - getSections', this.facebookIntegration)
    this.facebookSections = [];
    if (this.facebookIntegration) {
      // Add all the page integrations
      this.facebookIntegration.Accounts.forEach(p => this.facebookSections.push({
        id: p.id,
        name: `${p.name} (page)`,
        isGroup: false
      }));

      // Add all the group integrations
      this.facebookIntegration.Groups.forEach(p => this.facebookSections.push({
        id: p.id,
        name: `${p.name} (group)`,
        isGroup: true
      }));
    }
  }

  suggestionKeypress(event: KeyboardEvent, control: SubSuggestComponent) {
    control.keyPress(event);
  }

  suggestionUpdate(text: string, control: AbstractControl) {
    control.patchValue(text);
  }

}
