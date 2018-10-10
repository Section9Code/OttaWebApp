import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { RequeueModel, RequeueTimeSlot } from 'services/requeue.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ContentSearchLayoutComponent } from '../../content-search-layout/content-search-layout.component';

declare var $: any;

@Component({
  selector: 'app-requeue-timeslots',
  templateUrl: './requeue-timeslots.component.html',
  styleUrls: ['./requeue-timeslots.component.css']
})
export class RequeueTimeslotsComponent implements OnInit, OnChanges {
  // Parameters
  // The list of requeues to show
  @Input() requeues = new Array<RequeueModel>();
  // The number of hours each vertical block holds
  @Input() hoursPerBlock = 2;
  // The days of the week to be shown
  @Input() days = [1, 2, 3, 4, 5, 6, 0];
  // Called when a new timeslot should be added
  @Output() onAddTimeslot = new EventEmitter<RequeueTimeSlot>();
  // Called when a timeslot should be removed
  @Output() onRemoveTimeslot = new EventEmitter<string>();

  // Variables
  private hours = [];                       // The list of hours we are we going to show
  private timeslotForm: FormGroup;          // The form group holding the 'Add a timeslot' form
  private formHours = [];                   // The array of hours to show on a form
  private formMinutes = [];                 // The array of minuites to show on a form

  private displayData = new TimeslotDisplayData(); // The object holding all the data to be displayed

  constructor() {
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
    if (!queues || queues.length === 0) { return new TimeslotDisplayItem[0]; }

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
          newTimeslot.DayOfWeek = ts.DayOfTheWeek;
          items.push(newTimeslot);
        });
      }
    });

    return items;
  }

  cellSelected(day: TDDDay, hour: number) {
    console.log('Cell selected');

    // Find the timeslots in this cell
    const items = day.timeslotItems;

    if (items.length === 0) {
      // No timeslot items in cell, show add form
      this.showTimeslotAddForm(day.dayOfTheWeek, hour);
    } else {
      // Items in form show edit form
      console.log('- Edit');
    }
  }

  test(msg: string) {
    console.log(`Test - ${msg}`);
  }

  // Add a timeslot to a specific day and hour
  showTimeslotAddForm(day, hour) {
    console.log(`Add TS Day:${day} Hour:${hour}`);
    this.timeslotForm.reset();
    this.timeslotForm.controls.day.patchValue(day);
    this.timeslotForm.controls.hour.patchValue(hour);
    this.timeslotForm.controls.minutes.patchValue(0);

    $('#addTimeslotModal').modal('show');
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

export class TimeslotDisplayItem {
  Id: string;
  RequeueId: string;
  ColourHex: string;
  QueueName: string;
  TimeOfDay: number;
  DayOfWeek: number;
}

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