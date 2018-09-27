import { Component, OnInit, Input } from '@angular/core';
import { CimEditorCommon, ICimEditorCommon } from '../cim-editor-common';
import { IntegrationTypes, PinterestProjectIntegrationModel } from 'services/ContentProjectIntegration.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-cim-editor-pinterest',
  templateUrl: './cim-editor-pinterest.component.html',
  styleUrls: ['./cim-editor-pinterest.component.css']
})
export class CimEditorPinterestComponent extends CimEditorCommon implements ICimEditorCommon {
  @Input() pinterestIntegration = new PinterestProjectIntegrationModel();

  constructor() { 
    super();
    this.messageType = IntegrationTypes.Pinterest;
    this.settingsEditorHasImagePicker = true;
    this.settingsImagePickerName = 'pinterestImagePicker';

    // Make sure the section is required
    this.editorForm.get('imageUrl').setValidators(Validators.required);
    this.editorForm.get('section').setValidators(Validators.required);
  }

}
