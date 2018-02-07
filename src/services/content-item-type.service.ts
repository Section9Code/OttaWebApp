import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContentItemTypeService {
  private url: string = environment.baseApiUrl + '/api/ContentItemType';

  constructor(private authHttp: AuthHttp) {
  }

  getTypes(projectId: string): Observable<ContentItemTypeModel[]> {
    return this.authHttp.get(`${this.url}/${projectId}`).map(response => response.json());
  }

  getSingleType(projectId: string, id: string): Observable<ContentItemTypeModel> {
    return this.authHttp.get(`${this.url}/${projectId}/${id}`).map(response => response.json());
  }

  createType(projectId: string, content: ContentItemTypeModel): Observable<ContentItemTypeModel> {
    return this.authHttp.post(`${this.url}/${projectId}`, content).map(response => response.json());
  }

  updateType(content: ContentItemTypeModel): Observable<ContentItemTypeModel> {
    return this.authHttp.put(`${this.url}/${content.ProjectId}`, content).map(response => response.json());
  }

  deleteType(content: ContentItemTypeModel): Observable<null> {
    return this.authHttp.delete(`${this.url}/${content.ProjectId}/${content.id}`).map(response => response.json());
  }
}

export class ContentItemTypeModel {
  id: string;
  Title: string;
  ColourHex: string;
  ProjectId: string;
}
