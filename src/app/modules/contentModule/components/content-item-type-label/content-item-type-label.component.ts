import { Component, Input } from '@angular/core';

// Example
// <content-item-type-label [title]="" [colourHex]=""></content-item-type-label>

@Component({
    moduleId: module.id,
    selector: 'content-item-type-label',
    templateUrl: 'content-item-type-label.component.html',
    styleUrls: ['content-item-type-label.component.scss']
})
export class ContentItemTypeLabelComponent {
    @Input() colourHex: string;
    @Input() title: string;
}
