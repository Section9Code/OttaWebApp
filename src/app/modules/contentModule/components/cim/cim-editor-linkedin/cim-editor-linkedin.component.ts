import { Component, OnInit } from '@angular/core';
import { CimEditorCommon, ICimEditorCommon } from '../cim-editor-common';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';

@Component({
  selector: 'app-cim-editor-linkedin',
  templateUrl: './cim-editor-linkedin.component.html',
  styleUrls: ['./cim-editor-linkedin.component.css']
})
export class CimEditorLinkedinComponent extends CimEditorCommon implements ICimEditorCommon {

  constructor() {
    super();
    this.messageType = IntegrationTypes.LinkedIn;
    this.settingsEditorHasImagePicker = true;
    this.settingsImagePickerName = 'linkedinImagePicker';
  }

}
