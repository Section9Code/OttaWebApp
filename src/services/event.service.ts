import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EventService {
    private url: string = environment.baseApiUrl + '/api/ContentEvent';

    constructor(private authHttp: AuthHttp) {
    }

    getAllProjectEvents(projectId: string): Observable<EventDateModel[]> {
        return this.authHttp.get(`${this.url}/${projectId}`).map(response => response.json());
    };

    getAllPublicEventGroups(): Observable<EventGroupModel[]> {
        return this.authHttp.get(`${this.url}/groups`).map(response => response.json());
    }

    addPublicEventGroupToProject(projectId: string, eventGroupId: string): Observable<boolean> {
        return this.authHttp.post(`${this.url}/${projectId}/groups/public/${eventGroupId}`, null).map(response => response.json());
    }

    removePublicEventGroupFromProject(projectId: string, eventGroupId: string): Observable<boolean> {
        return this.authHttp.delete(`${this.url}/${projectId}/groups/public/${eventGroupId}`).map(response => response.json());
    }
}

export class EventDateModel { }

export class EventGroupModel {
    Name: string;
    Description: string;
    ColourHex: string;
}