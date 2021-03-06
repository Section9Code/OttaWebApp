import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { RequeueModel, RequeueTimeSlot } from 'services/requeue.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ContentSearchLayoutComponent } from '../../content-search-layout/content-search-layout.component';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-requeue-timeslots',
  templateUrl: './requeue-timeslots.component.html',
  styleUrls: ['./requeue-timeslots.component.css']
})
export class RequeueTimeslotsComponent implements OnInit, OnChanges {
  // Parameters
  @Input() requeues = new Array<RequeueModel>();                    // The list of requeues to show
  @Input() hoursPerBlock = 2;                                       // The number of hours each vertical block holds
  @Input() days = [1, 2, 3, 4, 5, 6, 0];                            // The days of the week to be shown
  @Input() linkToQueue = false;                                     // When set to true when an item is clicked on it will link to the queue rather than allow editing
  @Output() onAddTimeslot = new EventEmitter<RequeueTimeSlot>();    // Called when a new timeslot should be added
  @Output() onRemoveTimeslot = new EventEmitter<string>();          // Called when a timeslot should be removed

  // Variables
  hours = [];                                 // The list of hours we are we going to show
  timeslotForm: FormGroup;                    // The form group holding the 'Add a timeslot' form
  formHours = [];                             // The array of hours to show on a form
  formMinutes = [];                           // The array of minuites to show on a form
  displayData = new TimeslotDisplayData();    // The object holding all the data to be displayed on the page

  // For the edit form
  timeslotsToEdit: TimeslotDisplayItem[] = [];  // The list of timeslots to be edited
  editDay: number;                              // The day being edited
  editHour: number;                             // The hour being edited

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Setup the form
    this.timeslotForm = new FormGroup({
      day: new FormControl(''),
      hour: new FormControl(''),
      minutes: new FormControl('')
    });
  }

  ngOnInit() {
    // Setup hour block
    for (let i = 0; i < 24; i += this.hoursPerBlock) { this.hours.push(i); }

    // Setup the arrays used for the forms
    for (let i = 0; i < 24; i++) { this.formHours.push(i); }
    for (let i = 0; i < 60; i++) { this.formMinutes.push(i); }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('RequeueTimeslotsComponent - Changes', changes);

    // Has the queues value been changed
    const queues: SimpleChange = changes.requeues;
    if (queues.currentValue !== queues.previousValue) {
      // Queues have been updated, reload the data
      this.setupData(queues.currentValue);
    }
  }

  public setupData(queues: RequeueModel[]) {
    this.displayData = new TimeslotDisplayData();

    // Loop though all the hours
    this.hours.forEach(hr => {
      const tddLine = new TDDHour(hr);

      // Load the days for this hour
      tddLine.daysOfWeek.push(new TDDDay(1, this.timeslotItems(hr, this.hoursPerBlock, 1, queues)));   // Monday
      tddLine.daysOfWeek.push(new TDDDay(2, this.timeslotItems(hr, this.hoursPerBlock, 2, queues)));   // Tuesday
      tddLine.daysOfWeek.push(new TDDDay(3, this.timeslotItems(hr, this.hoursPerBlock, 3, queues)));   // Wednesday
      tddLine.daysOfWeek.push(new TDDDay(4, this.timeslotItems(hr, this.hoursPerBlock, 4, queues)));   // Thursday
      tddLine.daysOfWeek.push(new TDDDay(5, this.timeslotItems(hr, this.hoursPerBlock, 5, queues)));   // Friday
      tddLine.daysOfWeek.push(new TDDDay(6, this.timeslotItems(hr, this.hoursPerBlock, 6, queues)));   // Saturday
      tddLine.daysOfWeek.push(new TDDDay(0, this.timeslotItems(hr, this.hoursPerBlock, 0, queues)));   // Sunday

      // Store
      this.displayData.hours.push(tddLine);
    });

    console.log('Done setting up timeslot data', this.displayData);
  }

  // Return a list of timeslot items that meet the parameters
  private timeslotItems(hour: number, hoursPerBlock: number, day: number, queues: RequeueModel[]): TimeslotDisplayItem[] {
    if (!queues || queues.length === 0) { return []; }

    // Hold the list of items to be returned
    const items: TimeslotDisplayItem[] = [];

    const startTime = hour * 100;
    const endTime = (hour + hoursPerBlock) * 100;

    // Loop through all of the queues
    queues.forEach(queue => {
      if (queue.TimeSlots) {
        // Find all the queue items that match
        const qTimeslots = queue.TimeSlots.filter(ts => ts.DayOfTheWeek === day && (ts.UtcTimeOfDay >= startTime && ts.UtcTimeOfDay < endTime));

        // Loop through all the matching timeslots
        qTimeslots.forEach(ts => {
          // Add the timeslot to the list
          const newTimeslot = new TimeslotDisplayItem();
          newTimeslot.Id = ts.Id;
          newTimeslot.RequeueId = queue.id;
          newTimeslot.QueueName = queue.Name;
          newTimeslot.ColourHex = queue.ColourHex;
          newTimeslot.TimeOfDay = ts.UtcTimeOfDay;
          newTimeslot.DisplayTimeOfDay = this.pad(ts.UtcTimeOfDay, 4);
          newTimeslot.DayOfWeek = ts.DayOfTheWeek;
          items.push(newTimeslot);
        });
      }
    });

    return items;
  }

  // Pads out a number to be a set size
  pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) { s = '0' + s };
    return s;
  }

  // A user has clicked on an item
  cellSelected(day: TDDDay, hour: number) {
    if (this.linkToQueue) {
      // Disable the normal edit options
      return;
    }

    // Find the timeslots in this cell
    const items = day.timeslotItems;

    if (items.length === 0) {
      // No timeslot items in cell, show add form
      this.showTimeslotAddForm(day.dayOfTheWeek, hour);
    } else {
      // Items in form show edit form
      this.timeslotsToEdit = day.timeslotItems;
      this.showTimeslotEditForm(day.dayOfTheWeek, hour);
    }
  }

  timeslotSelected(item: TimeslotDisplayItem) {
    if (this.linkToQueue) {
      this.router.navigate([`${item.RequeueId}`], { relativeTo: this.activatedRoute });
    }
  }

  // Show the add form
  showTimeslotAddForm(day: number, hour: number) {
    this.timeslotForm.reset();
    this.timeslotForm.controls.day.patchValue(day);
    this.timeslotForm.controls.hour.patchValue(hour);
    this.timeslotForm.controls.minutes.patchValue(0);

    $('#addTimeslotModal').modal('show');
  }

  // Show the edit form
  showTimeslotEditForm(day: number, hour: number) {
    this.editDay = day;
    this.editHour = hour;
    $('#editTimeslotModal').modal('show');
  }

  addTimeslot() {
    const mins: number = +this.timeslotForm.controls.minutes.value;
    const hrs: number = +this.timeslotForm.controls.hour.value;
    const time = (hrs * 100) + mins;

    const ts = new RequeueTimeSlot();
    ts.DayOfTheWeek = +this.timeslotForm.controls.day.value;
    ts.UtcTimeOfDay = time;

    // Emit the add event
    this.onAddTimeslot.emit(ts);
    $('#addTimeslotModal').modal('hide');
  }

  editModalAddTimeslot() {
    console.log('Modal Add');
    $('#editTimeslotModal').modal('hide');
    this.showTimeslotAddForm(this.editDay, this.editHour);
  }

  editModalRemoveTimeslot(item: TimeslotDisplayItem) {
    console.log('Remove', item);
    $('#editTimeslotModal').modal('hide');
    this.removeTimeslot(item.Id);
  }

  removeTimeslot(id: string) {
    console.log('Remove timeslot', id);
    const ts = new RequeueTimeSlot();
    ts.Id = id;

    // Emit the add event
    this.onRemoveTimeslot.emit(id);
  }

  cancelTimeslotModal() {
    $('#addTimeslotModal').modal('hide');
  }

}



// A single timeslot item to be shown on the page
export class TimeslotDisplayItem {
  Id: string;
  RequeueId: string;
  ColourHex: string;
  QueueName: string;
  TimeOfDay: number;
  DisplayTimeOfDay: string;
  DayOfWeek: number;
}

// Classes for holding data to be displayed on the page.
// An array of display hours is held, then the days for each hour
// Finally the timeslot items for each position
export class TimeslotDisplayData {
  hours: TDDHour[];

  constructor() {
    this.hours = [];
  }
}

export class TDDHour {
  hour: number;
  daysOfWeek: TDDDay[];

  constructor(hour: number) {
    this.hour = hour;
    this.daysOfWeek = [];
  }
}

export class TDDDay {
  dayOfTheWeek: number;
  timeslotItems: TimeslotDisplayItem[];

  constructor(day: number, items: TimeslotDisplayItem[]) {
    this.dayOfTheWeek = day;
    this.timeslotItems = items;
  }
}