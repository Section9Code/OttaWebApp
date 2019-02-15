import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';
//import { Moment } from 'moment';
import * as moment from 'moment';
import { ContentItemService, ContentItemModel, CalendarDataModel } from 'services/content-item.service';
import { ContentProjectModel } from 'services/content-project.service';
import { ToastsManager } from 'ng2-toastr';
import { Observer } from 'rxjs/Observer';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { Router } from '@angular/router';
import { ContentProjectIntegrationService, IntegrationTypes } from 'services/ContentProjectIntegration.service';

declare var jQuery: any;

@Component({
  selector: 'content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.css']
})
export class ContentCalendarComponent implements OnInit, OnDestroy, OnChanges {
  // Using FullCalendar component - https://fullcalendar.io/

  @Input() showContentItems = true;
  @Input() showEvents = true;
  @Input() showRequeues = true;
  @Input() showMessages = true;

  currentProject: ContentProjectModel;              // The project we are currently showing
  isLoading = false;                                // Is data being loaded
  currentDate = new Date();                         // The current date being shown
  currentEvents: CalendarEvent[] = [];              // The events currently being shown on the calendar
  allEvents: CalendarDataModel;                     // All the events loaded from the system

  // Subscriptions
  currentProjectSub: Subscription;

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
    eventDrop: (event, delta, revertFunc, jsEvent, ui, view) => this.eventDrop(event, delta, revertFunc, jsEvent, ui, view),
    eventRender: (event, element) => this.eventRender(event, element)
  };

  constructor(
    private shared: ContentProjectShareService,
    private contentItemService: ContentItemService,
    private toast: ToastsManager,
    private router: Router) {
  }

  ngOnInit(): void {
    jQuery('#calendar').fullCalendar(this.calendarOptions);

    // Load the current projects information
    this.currentProjectSub = this.shared.currentProject.subscribe(
      response => {
        this.currentProject = response;
        // Now the project is loaded, Reload the calendar data
        jQuery('#calendar').fullCalendar('refetchEvents');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.currentProjectSub) {
      this.currentProjectSub.unsubscribe();
    }
  }

  // The input have been changed
  ngOnChanges(changes: SimpleChanges) {
    console.log('Calendar - Change', changes);

    // Reset the inputs based on the changes
    if (changes.showRequeues) { this.showRequeues = changes.showRequeues.currentValue; }
    if (changes.showContentItems) { this.showContentItems = changes.showContentItems.currentValue; }
    if (changes.showEvents) { this.showEvents = changes.showEvents.currentValue; }

    // Reload the calendar data if it has already been loaded in
    if (this.allEvents) {
      jQuery('#calendar').fullCalendar('refetchEvents');
    }
  }

  // Something has caused the data to need a reload. Called the first time the user loads the page
  async reloadData() {
    // Make sure the project data has loaded
    if (!this.currentProject || !this.currentProject.id) {
      return;
    };

    let year = this.currentDate.getFullYear();
    let month = this.currentDate.getMonth();
    console.log('Calendar Reload', `${year} - ${month}`);

    // Load the draft items for the period
    this.isLoading = true;
    this.allEvents = await this.contentItemService.getAllInMonth(this.currentProject.id, year, month + 1).toPromise();
    this.processContentItems(this.allEvents);
    jQuery('#calendar').fullCalendar('refetchEvents');
    this.isLoading = false;
  }

  // Process the returned content items into events to display on the calendar
  processContentItems(items: CalendarDataModel) {
    console.log('Calendar - processContentItems', items);
    // Clear the events
    this.currentEvents = [];

    // Process the content items
    if (this.showContentItems) {
      items.ContentItems.forEach(item => {
        if (item.DeadLine) {

          // Create the event
          let newEvent = new CalendarEvent();
          newEvent.id = item.id;
          newEvent.title = `${item.Title}`;
          newEvent.start = moment(item.DeadLine);
          newEvent.color = item.ContentTypeColourHex;
          //newEvent.borderColor = 'gray';

          newEvent.isContent = true;
          newEvent.isEvent = false;

          // Push the event to the list
          this.currentEvents.push(newEvent);
        }
      });
    }

    // Process the project events
    if (this.showEvents) {
      items.ProjectEvents.forEach(item => {
        var projectEventGroup = items.ProjectEventGroups.find(g => g.id === item.ParentEventGroupId);
        let projectEvent = new CalendarEvent();
        projectEvent.id = item.id;
        projectEvent.title = `${item.Title} - ${projectEventGroup.Name}`;
        projectEvent.icon = 'calendar';
        projectEvent.start = moment(item.StartDate);
        projectEvent.end = moment(item.EndDate);
        projectEvent.allDay = true;
        projectEvent.color = 'white';
        projectEvent.textColor = 'Black';

        projectEvent.isContent = false;
        projectEvent.isEvent = true;
        projectEvent.isRequeue = false;
        projectEvent.startEditable = false;
        projectEvent.durationEditable = false;

        if (projectEventGroup && projectEventGroup.ColourHex) {
          projectEvent.borderColor = items.ProjectEventGroups.find(g => g.id === item.ParentEventGroupId).ColourHex;
        }

        // Add the event to the list
        this.currentEvents.push(projectEvent);
      });

      // Process the public events
      items.PublicEvents.forEach(item => {
        const publicEventGroup = items.PublicEventGroups.find(g => g.id === item.ParentEventGroupId);
        let projectEvent = new CalendarEvent();
        projectEvent.id = item.id;
        projectEvent.title = `${item.Title} - ${publicEventGroup.Name}`;
        projectEvent.icon = 'calendar-o';
        projectEvent.start = moment(item.StartDate);
        projectEvent.end = moment(item.EndDate);
        projectEvent.allDay = true;
        projectEvent.color = 'white';
        projectEvent.textColor = 'Black';

        projectEvent.isContent = false;
        projectEvent.isEvent = true;
        projectEvent.isRequeue = false;
        projectEvent.startEditable = false;
        projectEvent.durationEditable = false;

        if (publicEventGroup) {
          projectEvent.borderColor = publicEventGroup.ColourHex;
        }

        // Add the event to the list
        this.currentEvents.push(projectEvent);
      });
    }

    // Process all timeslots
    if (this.showRequeues) {
      items.RequeueTimeslots.forEach(timeslot => {
        let slot = new CalendarEvent();
        slot.id = timeslot.RequeueId;
        slot.start = timeslot.Timeslot;
        slot.end = timeslot.Timeslot;
        slot.allDay = false;
        slot.color = 'white';
        slot.textColor = 'black';
        slot.borderColor = timeslot.ColourHex;
        slot.title = `${timeslot.RequeueName} (Requeue)`;
        slot.icon = 'list';
        slot.isContent = false;
        slot.isEvent = false;
        slot.isRequeue = true;

        this.currentEvents.push(slot);
      });
    }

    if (this.showMessages) {
      items.SocialMessages.forEach(item => {
        var msg = new CalendarEvent();
        msg.id = item.ContentItemId;
        msg.start = moment(item.PartitionKey, "YYYYMMDDHHmm");
        msg.end = moment(item.PartitionKey, "YYYYMMDDHHmm");
        msg.allDay = false;
        msg.color = 'white';
        msg.textColor = 'black';
        msg.borderColor = '#cccccc';
        msg.title = `${item.Message}`;
        msg.icon = this.calendarIcon(item.IntegrationType);
        msg.isContent = true;
        msg.isEvent = false;
        msg.isRequeue = true;

        this.currentEvents.push(msg);
      });
    }

  }

  private calendarIcon(messageType: IntegrationTypes): string {
    switch (messageType) {
      case IntegrationTypes.Twitter:
        return 'twitter';
      case IntegrationTypes.Facebook:
      case IntegrationTypes.FacebookGroup:
        return 'facebook';
      case IntegrationTypes.Google:
        return 'google';
      case IntegrationTypes.Instagram:
        return 'instagram';
      case IntegrationTypes.LinkedIn:
        return 'linkedin';
      case IntegrationTypes.Medium:
        return 'medium';
      case IntegrationTypes.Pinterest:
        return 'pinterest';
      case IntegrationTypes.Wordpress:
        return 'wordpress';
      default:
        return 'envelope';
    }
  }

  // Calendar events ----------------------------------------
  // Called to reload events when the user changes the month or picks a date
  async loadEvents(start, end, timezone, cb) {
    console.log('Loading events', [start, end]);
    console.log(`Changing view: start: ${start.year()}-${start.month()}-${start.date()} -- ${end.year()}-${end.month()}-${end.date()}`);

    // Make sure the project has loaded
    if (!this.currentProject || !this.currentProject.id) {
      cb([]);
      return;
    };

    // Load the dates requested
    this.isLoading = true;
    this.allEvents = await this.contentItemService.getAllInPeriod(this.currentProject.id, `${start.year()}-${start.month() + 1}-${start.date()}`, `${end.year()}-${end.month() + 1}-${end.date()}`).toPromise();
    this.processContentItems(this.allEvents);
    this.isLoading = false;
    cb(this.currentEvents);
  }

  // User has clicked on an event
  eventClicked(event, element) {
    console.log('Clicked', event);

    // Get the clicked item
    const eventData = this.currentEvents.find(e => e.id === event.id);
    if (eventData.isContent) {
      // Navigate to the draft page
      this.router.navigateByUrl(`/content/${this.currentProject.id}/items/${eventData.id}`);
    }

    if (eventData.isRequeue) {
      this.router.navigateByUrl(`/content/${this.currentProject.id}/requeue/${eventData.id}`);
    }
  }

  // Called when an event is rendered on the calendar. Used to insert an icon for the event if needed
  eventRender(event: CalendarEvent, element) {
    if (event.icon) {
      element.find('.fc-title').prepend('<i class="fa fa-' + event.icon + '"></i> ');
    }
  }

  eventDragStart(event: CalendarEvent, jsEvent, ui, view) {
    console.log('event drag started', event);
  }

  eventDragStop(event: CalendarEvent, jsEvent, ui, view) {
    console.log('Event drag stop', event);
  }

  eventDrop(event: CalendarEvent, delta, revertFunc, jsEvent, ui, view) {
    console.log('Event drop', event);
    console.log('Move item', event.id);
    console.log('Delta', event.start);

    if (!event.isContent) {
      // This is an event can can't be moved from the calendar
      console.log('Not content');
      return;
    }

    // Get the item from the system
    this.contentItemService.getSingle(this.currentProject.id, event.id).toPromise()
      .then(item => {

        // Update the items deadline
        let newDeadline: moment.Moment = event.start;
        item.DeadLine = new Date(newDeadline.toISOString() + '+00:00');

        // Update the content item with the new deadline
        this.contentItemService.updateItem(item).toPromise()
          .then(updateResponse => {
            this.toast.success('Item updated');
            this.shared.updateContent(item);
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
  icon: string;
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
  eventStartEditable: boolean;
  eventDurationEditable: boolean;

  isContent: boolean;
  isEvent: boolean;
  isRequeue: boolean;
}