import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { CreatorInfo } from 'services/suggestions.service';
import { Observable } from 'rxjs/Observable';
import { ContentItemTypeModel } from 'services/content-item-type.service';
import { EventDateModel, EventGroupModel } from './event.service';

@Injectable()
export class ContentItemService {
  private url: string = environment.baseApiUrl + '/api/ContentItem';

  constructor(private authHttp: AuthHttp) {
  }

  getAll(projectId: string): Observable<ContentItemModel[]> {
    return this.authHttp.get(`${this.url}/${projectId}/all`).map(response => response.json());
  }

  getSingle(projectId, id: string): Observable<ContentItemModel> {
    return this.authHttp.get(`${this.url}/${projectId}/${id}`).map(response => response.json());
  }

  createItem(projectId: string, content: ContentItemModel): Observable<ContentItemModel> {
    return this.authHttp.post(`${this.url}/${projectId}`, content).map(response => response.json());
  }

  updateItem(content: ContentItemModel): Observable<ContentItemModel> {
    return this.authHttp.put(`${this.url}/${content.ProjectId}/drafts/${content.id}`, content).map(response => response.json());
  }

  delete(content: ContentItemModel): Observable<boolean> {
    return this.authHttp.delete(`${this.url}/${content.ProjectId}/drafts/${content.id}`).map(response => response.json());
  }

  getAllInMonth(projectId: string, year: number, month: number): Observable<CalendarDataModel> {
    let fullUrl = `${this.url}/${projectId}/allMonth?year=${year}&month=${month}`;
    return this.authHttp.get(fullUrl).map(response => response.json());
  }

  getAllInPeriod(projectId: string, start: string, end: string): Observable<CalendarDataModel> {
    let fullUrl = `${this.url}/${projectId}/allPeriod?start=${start}&end=${end}`;
    return this.authHttp.get(fullUrl).map(response => response.json());
  }

  getItem(projectId, id: string): Observable<ContentItemModel> {
    return this.authHttp.get(`${this.url}/${projectId}/${id}`).map(response => response.json());
  }

}

export class ContentItemModel {
  id: string;
  Partition: string;
  Title: string;
  ProjectId: string;
  Description: string;

  State: string;

  ContentTypeId: string;
  ContentTypeTitle: string;
  ContentTypeColourHex: string;

  Created: Date;
  CreatorAuthId: string;
  Creator: CreatorInfo;
  DeadLine: Date;
  Tasks: ContentItemTask[];
  Tags: string[];
}

export class ContentItemTask {
  TaskName: string;
  DueDate: Date;
  AssignedTo: string;
  AssignedTpDetails: CreatorInfo;
}

export class CalendarDataModel {
  ContentItems: ContentItemModel[];
  ProjectEvents: EventDateModel[];
  PublicEvents: EventDateModel[];
  PublicEventGroups: EventGroupModel[];
  ProjectEventGroups: EventGroupModel[];
}