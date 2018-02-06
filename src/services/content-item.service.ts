import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { CreatorInfo } from 'services/suggestions.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContentItemService {
  private url: string = environment.baseApiUrl + '/api/ContentItem';

  constructor(private authHttp: AuthHttp) {
  }

  getDrafts(projectId: string): Observable<ContentItemModel[]> {
    return this.authHttp.get(`${this.url}/${projectId}/drafts`).map(response => response.json());
  }

}

export class ContentItemModel {
  Title: string;
  ProjectId: string;
  Description: string;
  IsDraft: string;
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
