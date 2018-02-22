import { Component, OnInit } from '@angular/core';
import { ContentProjectShareService } from '../../services/ContentProjectShareService';

declare var jQuery: any;

@Component({
  selector: 'content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.css']
})
export class ContentCalendarComponent implements OnInit {
  // Using FullCalendar component - https://fullcalendar.io/
  currentDate = '2018-02-22';

  currentEvents = [
    {
      title: 'All Day Event',
      start: '2018-02-01'
    },
    {
      title: 'Long Event',
      start: '2018-02-07',
      end: '2018-02-10'
    },
    {
      id: 999,
      title: 'Repeating Event',
      start: '2018-02-09T16:00:00'
    },
    {
      id: 999,
      title: 'Repeating Event',
      start: '2018-02-16T16:00:00'
    },
    {
      title: 'Conference',
      start: '2018-02-11',
      end: '2018-02-13'
    },
    {
      title: 'Meeting',
      start: '2018-02-12T10:30:00',
      end: '2018-02-12T12:30:00'
    },
    {
      title: 'Lunch',
      start: '2018-02-12T12:00:00'
    },
    {
      title: 'Meeting',
      start: '2018-02-12T14:30:00'
    },
    {
      title: 'Happy Hour',
      start: '2018-02-12T17:30:00'
    },
    {
      title: 'Dinner',
      start: '2018-02-12T20:00:00'
    },
    {
      title: 'Birthday Party',
      start: '2018-02-13T07:00:00'
    },
    {
      title: 'Click for Google',
      url: 'http://google.com/',
      start: '2018-02-28',
      icon : 'fa-camera-retro',
      id: 'aabbcc-dd'
    }
  ];

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

  constructor(private shared: ContentProjectShareService) {
  }

  ngOnInit(): void {
    jQuery('#calendar').fullCalendar(this.calendarOptions);
  }

  loadEvents(start, end, timezone, cb) {
    console.log('Loading events', [start, end]);
    cb(this.currentEvents);
  }

  eventClicked(event, element) {
    console.log('Clicked', event);
  }

  eventDragStart(event, jsEvent, ui, view){
    console.log('event drag started', event);
  }

  eventDragStop(event, jsEvent, ui, view) {
    console.log('Event drag stop', event);
  }

  eventDrop(event, delta, revertFunc, jsEvent, ui, view) {
    console.log('Event drop', event);
  }

}
