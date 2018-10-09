import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RequeueModel, RequeueTimeSlot } from 'services/requeue.service';
import { FormGroup, FormControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-requeue-timeslots',
  templateUrl: './requeue-timeslots.component.html',
  styleUrls: ['./requeue-timeslots.component.css']
})
export class RequeueTimeslotsComponent implements OnInit {
  // Parameters
  // The list of requeues to show
  @Input() requeues: RequeueModel[] = [];
  // The number of hours each vertical block holds
  @Input() hoursPerBlock = 2;
  // The days of the week to be shown
  @Input() days = [1, 2, 3, 4, 5, 6, 0];
  // Called when a new timeslot should be added
  @Output() onAddTimeslot = new EventEmitter<RequeueTimeSlot>();
  // Called when a timeslot should be removed
  @Output() onRemoveTimeslot = new EventEmitter<RequeueTimeSlot>();

  // Variables
  private hours = [];
  private timeslotForm: FormGroup;
  private formHours = [];
  private formMinutes = [];

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

  // Return a list of timeslot items that meet the parameters
  private timeslotItems(hour: number, hoursPerBlock: number, day: number): TimeslotDisplayItem[] {
    if (!this.requeues || this.requeues.length === 0) { return new TimeslotDisplayItem[0]; }

    // Hold the list of items to be returned
    const items: TimeslotDisplayItem[] = [];

    const startTime = hour * 100;
    const endTime = (hour + hoursPerBlock) * 100;

    // Loop through all of the queues
    this.requeues.forEach(queue => {
      if (queue.TimeSlots) {
        // Find all the queue items that match
        const qTimeslots = queue.TimeSlots.filter(ts => ts.DayOfTheWeek === day && (ts.UtcTimeOfDay >= startTime && ts.UtcTimeOfDay <= endTime));

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
