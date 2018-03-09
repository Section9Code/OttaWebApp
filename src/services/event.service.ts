import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EventService {
    private url: string = environment.baseApiUrl + '/api/ContentEvent';

    constructor(private authHttp: AuthHttp) {
    }

    // Public event functions -------------------------
    getAllProjectEvents(projectId: string): Observable<EventDateModel[]> {
        return this.authHttp.get(`${this.url}/${projectId}`).map(response => response.json());
    };

    getAllPublicEventGroups(): Observable<EventGroupModel[]> {
        return this.authHttp.get(`${this.url}/groups/public`).map(response => response.json());
    }

    addPublicEventGroupToProject(projectId: string, eventGroupId: string): Observable<boolean> {
        return this.authHttp.post(`${this.url}/${projectId}/groups/public/${eventGroupId}`, null).map(response => response.json());
    }

    removePublicEventGroupFromProject(projectId: string, eventGroupId: string): Observable<boolean> {
        return this.authHttp.delete(`${this.url}/${projectId}/groups/public/${eventGroupId}`).map(response => response.json());
    }


    // Private event functions ------------------------
    getAllProjectEventGroups(projectId: string): Observable<EventGroupModel[]>{
        return this.authHttp.get(`${this.url}/${projectId}/groups/private`).map(response => response.json());
    }

    addEventGroup(projectId: string, group: EventGroupModel): Observable<EventGroupModel> {
        return this.authHttp.post(`${this.url}/${projectId}/groups/private`, group).map(response => response.json());
    }
}

export class EventDateModel { }

export class EventGroupModel {
    id: string;
    Name: string;
    Description: string;
    ColourHex: string;
    ProjectId: string;
}