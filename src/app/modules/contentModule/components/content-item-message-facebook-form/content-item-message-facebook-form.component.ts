import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IContentItemMessageForm } from '../IContentItemMessageForm';
import { ContentItemMessageModel, ContentItemModel } from 'services/content-item.service';

@Component({
  selector: 'app-content-item-message-facebook-form',
  templateUrl: './content-item-message-facebook-form.component.html',
  styleUrls: ['./content-item-message-facebook-form.component.css']
})
export class ContentItemMessageFacebookFormComponent implements IContentItemMessageForm {
  // Component inputs/outputs
  @Input() contentItem: ContentItemModel = new ContentItemModel();
  @Input() images: string[] = [];
  @Output() messageAdded = new EventEmitter();



  constructor() { }

  resetForm() {
    console.log('Facebook form: Reset');
  }

  editMessage(message: ContentItemMessageModel) {
    console.log('Facebook form: Edit message', message);
  }

}
