import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentItemModel } from 'services/content-item.service';

// Example
// <content-item-details [data]="contentItemData" showCancel=true [isUpdating]="isUpdatingVariable" (submitClicked)="submitMethod(data)" (cancelClicked)="cancelMethod()"></content-item-details>

@Component({
    moduleId: module.id,
    selector: 'content-item-details',
    templateUrl: 'content-item-details.component.html',
    styleUrls: ['content-item-details.component.scss']
})
export class ContentItemDetailsComponent {
    // Variables
    @Input() data: ContentItemModel = new ContentItemModel();
    @Input() showCancel = true;
    @Input() isUpdating = false;
    @Input() createButtonText = 'Create';
    @Input() cancelButtonText = 'Cancel';

    // Events
    @Output() submitClicked = new EventEmitter<ContentItemModel>();
    @Output() cancelClicked = new EventEmitter<any>();

    constructor() {
    }

    submitForm() {
        console.log('Component: Submit form');
        this.submitClicked.emit(this.data);
    }

    cancelForm() {
        console.log('Component: Cancel form');
        this.cancelClicked.emit();
    }
}
