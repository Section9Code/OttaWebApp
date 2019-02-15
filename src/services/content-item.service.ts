import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { CreatorInfo } from 'services/suggestions.service';
import { Observable } from 'rxjs/Observable';
import { ContentItemTypeModel } from 'services/content-item-type.service';
import { EventDateModel, EventGroupModel } from './event.service';
import { WordpressLinkModel, IntegrationTypes } from './ContentProjectIntegration.service';

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

  search(criteria: string): Observable<ContentItemModel[]> {
    return this.authHttp.get(`${this.url}/search?criteria=${criteria}`).map(response => response.json());
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

  addMessage(projectId: string, contentItemId: string, message: ContentItemMessageModel): Observable<ContentItemMessageModel> {
    return this.authHttp.post(`${this.url}/${projectId}/${contentItemId}/message`, message).map(response => response.json());
  }

  deleteMessage(projectId: string, contentItemId: string, messageId: string): Observable<boolean> {
    return this.authHttp.delete(`${this.url}/${projectId}/${contentItemId}/message/${messageId}`).map(response => response.json());
  }

}

export class ContentItemModel {
  id: string;
  Partition: string;
  Title: string;
  ProjectId: string;
  Description: string;

  State: string;

  Archived: boolean;
  ArchivedDate: Date;

  ContentTypeId: string;
  ContentTypeTitle: string;
  ContentTypeColourHex: string;

  Created: Date;
  CreatorAuthId: string;
  Creator: CreatorInfo;

  DeadLine: Date;
  Tasks: ContentItemTask[];
  Tags: string[];

  // Integrations
  WordpressLink: WordpressLinkModel;

  // Messages
  SocialMediaMessages: ContentItemMessageModel[];

  // Substitutions
  Substitutions: ContentItemMessageSubstitution[];

  // Primary URL to the content item
  PrimaryUrl: string;
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
  RequeueTimeslots: TimeslotDate[];
  SocialMessages: ContentItemMessageEntityModel[];
}

export class TimeslotDate {
  RequeueId: string;
  RequeueName: string;
  Timeslot: Date;
  ColourHex: string;
}

export class ContentItemMessageModel {
  // Id of the message
  Id: string;

  // Time the message will be sent
  SendTime: string;

  // The type of message
  MessageType: IntegrationTypes;

  // The ID of the section on the remote system the message should be put into
  // For Facebook this is the ID of the page the user wants to post to
  RemoteSystemSectionId: string;

  // Is this message relative to the publish date of the content item
  IsRelative: boolean;
  RelativeSendValue: number;
  RelativeSendUnit: ContentItemMessageRelativeUnitModel;

  // This is the text that the user edits
  EditorText: string;

  Title: string;
  Message: string;
  ImageUrl: string;
  LinkUrl: string;

  // Additional data
  AdditionalData: object;

  // Requeue settings
  Requeue: boolean;
  RequeueToQueueId: string;

  // Related ContentItemMessage link
  LinkedItemPartition: string;
  LinkedItemRowKey: string;
}

export class ContentItemMessageEntityModel {
  PartitionKey: string;
  RowKey: string;
  IntegrationType: number;
  OrganisationId: string;
  ProjectId: string;
  ContentItemId: string;
  Title: string;
  Message: string;
  ImageUrl: string;
  Sent: Date;
  ErrorMessage: string;
  LinkUrl: string;
  RemoteSystemSectionId: string;
  AdditionalData: string;
  Requeue: boolean;
  RequeueId: string;
}

export enum ContentItemMessageRelativeUnitModel {
  Minutes,  // 0
  Hours,    // 1
  Days,     // 2
  Weeks,    // 3
  Months    // 4
}

export class ContentItemMessageSubstitution {
  name: string;
  value: string;

  constructor(name: string, val: string) {
    this.name = name;
    this.value = val;
  }
}