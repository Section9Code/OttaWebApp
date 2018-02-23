import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';
//import { Moment } from 'moment';
import * as moment from 'moment';
import { ContentItemService, ContentItemModel } from 'services/content-item.service';
import { ContentProjectModel } from 'services/content-project.service';
import { ToastsManager } from 'ng2-toastr';
import { Observer } from 'rxjs/Observer';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';

declare var jQuery: any;

@Component({
  selector: 'content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.css']
})
export class ContentCalendarComponent implements OnInit, OnDestroy {
  // Using FullCalendar component - https://fullcalendar.io/

  // Current project
  currentProject: ContentProjectModel;

  isLoading = false;

  // Subscriptions
  currentProjectSub: Subscription;
  dataLoadSub: Subscription;

  // Current date being shown
  currentDate = new Date();

  // Hold the list of events
  currentEvents: CalendarEvent[] = [];

  // Setup the calendar
  calendarOptions: Object = {
    header: {
      left: 'title',
      center: 'month basicWeek listMonth',
      right: 'today prev,next'
    },
    themeSystem: 'bootstrap3',
    fixedWeekCount: false,
    defaultDate: this.currentDate,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    eventStartEditable: true,
    eventDurationEditable: false,
    events: (start, end, timezone, cb) => this.loadEvents(start, end, timezone, cb),
    eventClick: (event, element) => this.eventClicked(event, element),
    eventDragStart: (event, jsEvent, ui, view) => this.eventDragStart(event, jsEvent, ui, view),
    eventDragStop: (event, jsEvent, ui, view) => this.eventDragStop(event, jsEvent, ui, view),
    eventDrop: (event, delta, revertFunc, jsEvent, ui, view) => this.eventDrop(event, delta, revertFunc, jsEvent, ui, view)
  };

  constructor(private shared: ContentProjectShareService, private contentItemService: ContentItemService, private toast: ToastsManager) {
  }

  ngOnInit(): void {
    jQuery('#calendar').fullCalendar(this.calendarOptions);

    this.currentProjectSub = this.shared.currentProject.subscribe(
      response => {
        this.currentProject = response;
        this.reloadData();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.currentProjectSub) {
      this.currentProjectSub.unsubscribe();
    }

    if (this.dataLoadSub) {
      this.dataLoadSub.unsubscribe();
    }
  }

  // Something has caused the data to need a reload
  reloadData() {
    // Make sure the project data has loaded
    if (!this.currentProject || !this.currentProject.id) {
      return;
    };

    let year = this.currentDate.getFullYear();
    let month = this.currentDate.getMonth();
    console.log('Calendar Reload', `${year} - ${month}`);

    // Load the draft items for the period
    this.isLoading = true;
    this.dataLoadSub = this.contentItemService.getAllInPeriod(this.currentProject.id, year, month+1).subscribe(
      response => this.processContentItems(response),
      error => {
        console.log('Error loading content');
        this.isLoading = false;
        this.toast.error('Unable to load content calendar', 'Error occurred');
      },
      () => this.isLoading = false
    );
  }

  processContentItems(items: ContentItemModel[]) {
    // Clear the events
    this.currentEvents = [];

    console.log('Calendar: Processing content items', items);
    items.forEach(item => {
      if (item.DeadLine) {
        // Create the event
        let newEvent = new CalendarEvent();
        newEvent.id = item.id;
        newEvent.title = `Draft - ${item.Title}`;
        newEvent.start = moment(item.DeadLine);
        newEvent.color = item.ContentTypeColourHex;
        newEvent.borderColor = 'gray';
        // Push the event to the list
        this.currentEvents.push(newEvent);
      }
    });

    // Reload the events into the calendar
    jQuery('#calendar').fullCalendar('refetchEvents')
  }

  // Calendar events ----------------------------------------
  loadEvents(start, end, timezone, cb) {
    console.log('Loading events', [start, end]);
    cb(this.currentEvents);
  }

  eventClicked(event, element) {
    console.log('Clicked', event);
  }

  eventDragStart(event, jsEvent, ui, view) {
    console.log('event drag started', event);
  }

  eventDragStop(event, jsEvent, ui, view) {
    console.log('Event drag stop', event);
  }

  eventDrop(event, delta, revertFunc, jsEvent, ui, view) {
    console.log('Event drop', event);
  }

}

export class CalendarEvent {
  id: string;
  title: string;
  allDay: boolean;
  start: any;
  end: any;
  url: string;
  className: string;
  editable: boolean;
  startEditable: boolean;
  durationEditable: boolean;
  resourceEditable: boolean;
  rendering: string;
  overlap: boolean;
  constraint: string;
  source: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}