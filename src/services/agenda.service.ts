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
  getAgenda(): Observable<Agenda> {
    return this.authHttp.get(`${this.url}`).map(response => response.json());
  }
}

export class Agenda {
  StartDate: Date;
  EndDate: Date;
  Projects: AgendaProject[];
}

export class AgendaProject {
  Title: string;
  Id: string;
  Data: AgendaDay[];
}

export class AgendaDay {
  Date: Date;
  Items: AgendaItem[];
}

export class AgendaItem {
  Id: string;
  ProjectId: string;
  Occurs: Date;
  Type: AgendaItemType;
  ColourHex: string;
  Title: string;
  Description: string;
}

export enum AgendaItemType {
  ContentItem,
  Event
}