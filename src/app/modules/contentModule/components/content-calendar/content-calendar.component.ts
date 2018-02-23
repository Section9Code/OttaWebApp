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
import { Router } from '@angular/router';

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

  constructor(private shared: ContentProjectShareService, private contentItemService: ContentItemService, private toast: ToastsManager,
    private router: Router) {
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
    this.dataLoadSub = this.contentItemService.getAllInMonth(this.currentProject.id, year, month + 1).subscribe(
      response => {
        this.processContentItems(response);
        jQuery('#calendar').fullCalendar('refetchEvents');
      },
      error => {
        console.log('Error loading content');
        this.isLoading = false;
        this.toast.error('Unable to load content calendar', 'Error occurred');
      },
      () => this.isLoading = false
    );
  }

  // Process the returned content items into events to display on the calendar
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
        newEvent.isDraft = true;
        // Push the event to the list
        this.currentEvents.push(newEvent);
      }
    });
  }

  // Calendar events ----------------------------------------
  loadEvents(start, end, timezone, cb) {
    console.log('Loading events', [start, end]);
    console.log(`Changing view: start: ${start.year()}-${start.month()}-${start.date()} -- ${end.year()}-${end.month()}-${end.date()}`);

    // Make sure the project has loaded
    if (!this.currentProject || !this.currentProject.id) {
      cb([]);
      return;
    };

    // Load the dates requested
    this.dataLoadSub = this.contentItemService.getAllInPeriod(this.currentProject.id, `${start.year()}-${start.month() + 1}-${start.date()}`, `${end.year()}-${end.month() + 1}-${end.date()}`).subscribe(
      response => {
        this.processContentItems(response)
        cb(this.currentEvents);
      },
      error => {
        console.log('Error loading content');
        this.isLoading = false;
        this.toast.error('Unable to load content calendar', 'Error occurred');
        cb(this.currentEvents);
      },
      () => this.isLoading = false
    );
  }

  eventClicked(event, element) {
    console.log('Clicked', event);

    // Get the clicked item
    var eventData = this.currentEvents.find(e => e.id === event.id);
    if(eventData.isDraft)
    {
      this.navigateToDraft(eventData.id);
    }
  }

  navigateToDraft(draftId: string) {
    let url = `/content/${this.currentProject.id}/drafts/${draftId}`;
    this.router.navigateByUrl(url);
  }

  eventDragStart(event, jsEvent, ui, view) {
    console.log('event drag started', event);
  }

  eventDragStop(event, jsEvent, ui, view) {
    console.log('Event drag stop', event);
  }

  eventDrop(event, delta, revertFunc, jsEvent, ui, view) {
    console.log('Event drop', event);
    console.log('Move item', event.id);
    console.log('Delta', event.start);

    // Get the item
    this.contentItemService.getDraft(this.currentProject.id, event.id).toPromise()
      .then(item => {
        let newDeadline: moment.Moment = event.start;
        item.DeadLine = new Date(newDeadline.year(), newDeadline.month(), newDeadline.date());
        this.contentItemService.updateDraft(item).toPromise()
          .then(updateResponse => {
            this.toast.success('Item updated');
            this.shared.updateDraft(item);
          })
          .catch(error => {
            this.toast.error('Unable to update item');
          });
      })
      .catch(error => {
        this.toast.error('Unable to find item');
      });
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

  isDraft: boolean;
}