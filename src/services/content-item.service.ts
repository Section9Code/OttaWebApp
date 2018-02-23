import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { CreatorInfo } from 'services/suggestions.service';
import { Observable } from 'rxjs/Observable';
import { ContentItemTypeModel } from 'services/content-item-type.service';

@Injectable()
export class ContentItemService {
  private url: string = environment.baseApiUrl + '/api/ContentItem';

  constructor(private authHttp: AuthHttp) {
  }

  getDrafts(projectId: string): Observable<ContentItemModel[]> {
    return this.authHttp.get(`${this.url}/${projectId}/drafts`).map(response => response.json());
  }

  getDraft(projectId, id: string): Observable<ContentItemModel> {
    return this.authHttp.get(`${this.url}/${projectId}/drafts/${id}`).map(response => response.json());
  }

  createDraft(projectId: string, content: ContentItemModel): Observable<ContentItemModel> {
    return this.authHttp.post(`${this.url}/${projectId}/drafts`, content).map(response => response.json());
  }

  updateDraft(content: ContentItemModel): Observable<ContentItemModel> {
    return this.authHttp.put(`${this.url}/${content.ProjectId}/drafts/${content.id}`, content).map(response => response.json());
  }

  getAll(projectId: string): Observable<ContentItemModel[]> {
    return this.authHttp.get(`${this.url}/${projectId}/all`).map(response => response.json());
  }

  getAllInPeriod(projectId: string, year: number, month: number): Observable<ContentItemModel[]> {
    let fullUrl = `${this.url}/${projectId}/allPeriod?year=${year}&month=${month}`;
    return this.authHttp.get(fullUrl).map(response => response.json());
  }

}

export class ContentItemModel {
  id: string;
  Partition: string;
  Title: string;
  ProjectId: string;
  Description: string;
  IsDraft: string;

  ContentTypeId: string;
  ContentTypeTitle: string;
  ContentTypeColourHex: string;

  Content: string;

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
