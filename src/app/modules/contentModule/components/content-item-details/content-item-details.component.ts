import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ContentItemModel } from 'services/content-item.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentItemTypeModel } from 'services/content-item-type.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { ContentItemContentModel } from 'services/content-item-content.service';

// Example
// <content-item-details [data]="contentItemData" [content]="contentItemContentData" showCancel=true [isUpdating]="isUpdatingVariable" (submitClicked)="submitMethod(data)" (cancelClicked)="cancelMethod()" [hideHtmlEditor]="false"></content-item-details>

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

    // List of all the available content types
    contentTypes: ContentItemTypeModel[];

    // Options for the freola html editor
    editorOptions: Object = {
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false
    };

    displayDeadLineDate: any;

    // Options for the date picker
    datePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'dd mmm yyyy',
    };

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
            const currentDate = this.data.DeadLine.toString();

            // tslint:disable-next-line:max-line-length
            const newDate = { date: { year: +currentDate.substring(0, 4), month: +currentDate.substring(5, 7), day: +currentDate.substring(8, 10) } };
            this.displayDeadLineDate = newDate;
        }
    }


    submitForm() {
        console.log('Component: Submit form');

        // The deadline date of the item needs to be reformatted
        if (this.displayDeadLineDate) {
            // Update the format
            const selectedDate: any = this.displayDeadLineDate;
            var dateString: string = `${selectedDate.date.year}-${selectedDate.date.month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}-${selectedDate.date.day.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}T00:00:00+00:00`;
            this.data.DeadLine = new Date(dateString);
        }
        else
        {
            // No deadline date
            this.data.DeadLine = null;
        }

        const dataGram: ContentDataMessage = {contentItem: this.data, content: this.content.Content};
        this.submitClicked.emit(dataGram);
    }


    cancelForm() {
        console.log('Component: Cancel form');
        this.cancelClicked.emit();
    }
}

export class ContentDataMessage {
    contentItem: ContentItemModel;
    content: string;
}
