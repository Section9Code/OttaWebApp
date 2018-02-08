import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ContentItemModel } from 'services/content-item.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentItemTypeModel } from 'services/content-item-type.service';

// Example
// <content-item-details [data]="contentItemData" showCancel=true [isUpdating]="isUpdatingVariable" (submitClicked)="submitMethod(data)" (cancelClicked)="cancelMethod()"></content-item-details>

@Component({
    moduleId: module.id,
    selector: 'content-item-details',
    templateUrl: 'content-item-details.component.html',
    styleUrls: ['content-item-details.component.scss']
})
export class ContentItemDetailsComponent implements OnInit {    
    // Variables
    @Input() data: ContentItemModel = new ContentItemModel();
    @Input() showCancel = true;
    @Input() isUpdating = false;
    @Input() createButtonText = 'Create';
    @Input() cancelButtonText = 'Cancel';

    contentTypes: ContentItemTypeModel[];

    // Events
    @Output() submitClicked = new EventEmitter<ContentItemModel>();
    @Output() cancelClicked = new EventEmitter<any>();

    constructor(private sharedService: ContentProjectShareService) {
    }

    ngOnInit(): void {
        // Get the available content types
        this.sharedService.contentTypes.subscribe(response => this.contentTypes = response);
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
