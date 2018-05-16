import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ContentItemModel } from 'services/content-item.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentItemTypeModel } from 'services/content-item-type.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { ContentItemContentModel } from 'services/content-item-content.service';
import * as moment from 'moment';

// Example
// <content-item-details [data]="contentItemData" [content]="contentItemContentData" showCancel=true [isUpdating]="isUpdatingVariable" (submitClicked)="submitMethod(data)" (cancelClicked)="cancelMethod()" [hideHtmlEditor]="false" [minimalForm]="false" [hideCloseButton]="false"></content-item-details>

@Component({
    moduleId: module.id,
    selector: 'content-item-details',
    templateUrl: 'content-item-details.component.html',
    styleUrls: ['content-item-details.component.scss']
})
export class ContentItemDetailsComponent implements OnInit {
    // Variables
    @Input() data: ContentItemModel = new ContentItemModel();
    @Input() content: ContentItemContentModel = new ContentItemContentModel();
    @Input() showCancel = true;
    @Input() isUpdating = false;
    @Input() createButtonText = 'Create';
    @Input() cancelButtonText = 'Cancel';
    @Input() hideHtmlEditor = false;
    @Input() minimalForm = false;
    @Input() hideCloseButton = false;

    // List of all the available content types
    contentTypes: ContentItemTypeModel[];

    // Options for the freola html editor
    editorOptions: Object = {
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false
    };

    // Set the min date for the deadline datetime picker to be now
    datePickerMinDate = moment();
    displayDeadLineDate: moment.Moment;

    // Events
    @Output() submitClicked = new EventEmitter<ContentDataMessage>();
    @Output() cancelClicked = new EventEmitter<any>();

    constructor(private sharedService: ContentProjectShareService) {
    }


    ngOnInit(): void {
        // Get the available content types
        this.sharedService.contentTypes.subscribe(response => this.contentTypes = response);

        // Reformat the date into something the data picker understands
        if (this.data.DeadLine) {
            this.displayDeadLineDate = moment(this.data.DeadLine);
        }
    }


    submitForm(closeWhenDone: boolean) {
        console.log('Component: Submit form', this.displayDeadLineDate);

        // The deadline date of the item needs to be reformatted
        if (this.displayDeadLineDate) {
            // Update the format
            this.data.DeadLine = new Date(this.displayDeadLineDate.toISOString());
        }
        else {
            // No deadline date
            this.data.DeadLine = null;
        }

        // Send the create event
        const dataGram: ContentDataMessage = { contentItem: this.data, content: this.content.Content, closeOnCompletion: closeWhenDone };
        this.submitClicked.emit(dataGram);
    }


    cancelForm() {
        console.log('Component: Cancel form');
        this.cancelClicked.emit();
    }

    resetForm() {
        console.log('Reset form');
        this.isUpdating = false;
        this.data = new ContentItemModel();
    }

}

export class ContentDataMessage {
    contentItem: ContentItemModel;
    content: string;
    closeOnCompletion = false;
}
