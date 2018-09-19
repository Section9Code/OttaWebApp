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
  getSingle(projectId: string, queueId: string): Observable<RequeueModel[]> {
    return this.authHttp.get(`${this.url}/${projectId}/${queueId}`).map(response => response.json());
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