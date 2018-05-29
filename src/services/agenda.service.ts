import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class AgendaService {
  private url: string = environment.baseApiUrl + '/api/agenda';

  constructor(
    private authHttp: AuthHttp
  ) { }

  // Get the agenda for the current user
  getAgenda(): Observable<AgendaModel> {
    return this.authHttp.get(`${this.url}`).map(response => response.json());
  }
}

export class AgendaModel {
  StartDate: Date;
  EndDate: Date;
  Projects: AgendaProjectModel[];
}

export class AgendaProjectModel {
  Title: string;
  Id: string;
  Data: AgendaDayModel[];
}

export class AgendaDayModel {
  Date: Date;
  Items: AgendaItemModel[];
}

export class AgendaItemModel {
  Id: string;
  ProjectId: string;
  Occurs: Date;
  Type: AgendaItemTypeEnum;
  ColourHex: string;
  Title: string;
  Description: string;
}

export enum AgendaItemTypeEnum {
  ContentItem,
  Event
}