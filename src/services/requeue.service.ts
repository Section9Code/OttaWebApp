import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { ContentItemMessageModel } from './content-item.service';

@Injectable()
export class RequeueService {
  private url: string = environment.baseApiUrl + '/api/requeue';

  constructor(private authHttp: AuthHttp) { }

  // Get all of the requeue items for a project
  getAll(projectId: string): Observable<RequeueReducedModel[]> {
    return this.authHttp.get(`${this.url}/${projectId}`).map(response => response.json());
  }

  // Get a single requeue item
  getSingle(projectId: string, queueId: string): Observable<RequeueModel> {
    return this.authHttp.get(`${this.url}/${projectId}/${queueId}`).map(response => response.json());
  }

  // Create a new queue
  create(projectId: string, queue: RequeueModel): Observable<RequeueModel> {
    return this.authHttp.post(`${this.url}/${projectId}`, queue).map(response => response.json());
  }

  // Update a queue
  update(projectId: string, queue: RequeueModel): Observable<RequeueModel> {
    return this.authHttp.put(`${this.url}/${projectId}/${queue.id}`, queue).map(response => response.json());
  }

  // Delete a queue
  delete(projectId: string, queueId: string): Observable<void> {
    return this.authHttp.delete(`${this.url}/${projectId}/${queueId}`).map(response => { });
  }

  // Add a message
  addMessage(projectId: string, queueId: string, message: ContentItemMessageModel): Observable<ContentItemMessageModel> {
    return this.authHttp.post(`${this.url}/${projectId}/${queueId}/messages`, message).map(response => response.json());
  }

  // Update a message
  updateMessage(projectId: string, queueId: string, message: ContentItemMessageModel): Observable<ContentItemMessageModel> {
    return this.authHttp.put(`${this.url}/${projectId}/${queueId}/messages/${message.Id}`, message).map(response => response.json());
  }

  // Remove a message
  removeMessage(projectId: string, queueId: string, messageId: string): Observable<void> {
    return this.authHttp.delete(`${this.url}/${projectId}/${queueId}/messages/${messageId}`).map(response => { });
  }

  // Add a timeslot
  addTimeslot(projectId: string, queueId: string, timeslot: RequeueTimeSlot): Observable<void> {
    return this.authHttp.post(`${this.url}/${projectId}/${queueId}/timeslot`, timeslot).map(response => { });
  }

  // Remove a timeslot
  removeTimeslot(projectId: string, queueId: string, timeslotId: string): Observable<void> {
    return this.authHttp.delete(`${this.url}/${projectId}/${queueId}/timeslot/${timeslotId}`).map(response => { });
  }
}

export class RequeueModel {
  id: string;
  Name: string;
  ProjectId: string;
  ColourHex: string;
  NextItemIndex: number;
  Messages: ContentItemMessageModel[];
  TimeSlots: RequeueTimeSlot[];

  constructor() {
    this.Messages = [];
  }
}

export class RequeueTimeSlot {
  Id: string;
  DayOfTheWeek: RequeueDayOfTheWeek;
  UtcTimeOfDay: number;
}

export enum RequeueDayOfTheWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export class RequeueReducedModel {
  Id: string;
  Name: string;
  ProjectId: string;
  ColourHex: string;
  Messages: number;
  TimeSlots: number;
}
