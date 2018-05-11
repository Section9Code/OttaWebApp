import { Component, OnInit, Input } from '@angular/core';
import { ContentItemMessageModel } from 'services/content-item.service';

// Renders a preview of what a twitter message will look like
@Component({
  selector: 'app-content-item-message-twitter-preview',
  templateUrl: './content-item-message-twitter-preview.component.html',
  styleUrls: ['./content-item-message-twitter-preview.component.css']
})
export class ContentItemMessageTwitterPreviewComponent implements OnInit {
  @Input() message: ContentItemMessageModel = new ContentItemMessageModel();

  constructor() { }

  ngOnInit() {
  }

}
