import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContentItemMessageSubstitution, ContentItemMessageModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';



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
export class CimEditorTwitterComponent extends CimEditorCommon implements OnInit, ICimEditorCommon {
  editorForm: FormGroup;

  constructor() {
    super();

    this.editorForm = new FormGroup({
      message: new FormControl('', Validators.required),
      image: new FormControl(''),
      sendTime: new FormControl(moment().add(5, 'minutes').toISOString()),
      isRelative: new FormControl(),
      relativeSendValue: new FormControl(),
      relativeSendUnit: new FormControl
    });
  }

  ngOnInit() {
  }

  // Reset the editor
  public reset() {
    this.editorForm.reset();
  }

}


