import { Component, OnInit } from '@angular/core';
import { CimEditorCommon, ICimEditorCommon } from '../cim-editor-common';
import { IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { ContentItemMessageModel } from 'services/content-item.service';

@Component({
  selector: 'app-cim-editor-facebook',
  templateUrl: './cim-editor-facebook.component.html',
  styleUrls: ['./cim-editor-facebook.component.css']
})
export class CimEditorFacebookComponent extends CimEditorCommon implements ICimEditorCommon {

  constructor() {
    super();
    this.messageType = IntegrationTypes.Facebook;
  }

}
