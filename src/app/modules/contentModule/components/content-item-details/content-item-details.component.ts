import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ContentItemModel } from 'services/content-item.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentItemTypeModel } from 'services/content-item-type.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

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
    @Output() submitClicked = new EventEmitter<ContentItemModel>();
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

        // Reformat date selected by the user
        if (this.displayDeadLineDate) {
            const selectedDate: any = this.displayDeadLineDate;
            this.data.DeadLine = new Date(selectedDate.date.year, selectedDate.date.month - 1, selectedDate.date.day, 0, 0, 0, 0);
        }

        this.submitClicked.emit(this.data);
    }


    cancelForm() {
        console.log('Component: Cancel form');
        this.cancelClicked.emit();
    }
}
