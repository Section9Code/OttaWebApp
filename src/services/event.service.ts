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

    getAllPublicEventGroupsGrouped(): Observable<EventGroupModelGrouped[]> {
        return this.authHttp.get(`${this.url}/groups/public-grouped`).map(response => response.json());
    }


    addPublicEventGroupToProject(projectId: string, eventGroupId: string): Observable<boolean> {
        return this.authHttp.post(`${this.url}/${projectId}/groups/public/${eventGroupId}`, null).map(response => response.json());
    }

    removePublicEventGroupFromProject(projectId: string, eventGroupId: string): Observable<boolean> {
        return this.authHttp.delete(`${this.url}/${projectId}/groups/public/${eventGroupId}`).map(response => response.json());
    }


    // Private event functions ------------------------
    getAllProjectEventGroups(projectId: string): Observable<EventGroupDatesModel[]> {
        return this.authHttp.get(`${this.url}/${projectId}/groups/private`).map(response => response.json());
    }

    addEventGroup(projectId: string, group: EventGroupModel): Observable<EventGroupModel> {
        return this.authHttp.post(`${this.url}/${projectId}/groups/private`, group).map(response => response.json());
    }

    removeEventGroup(projectId: string, groupId: string): Observable<EventGroupModel> {
        return this.authHttp.delete(`${this.url}/${projectId}/groups/private/${groupId}`).map(response => response.json());
    }

    addPrivateDate(projectId: string, date: EventDateModel): Observable<EventDateModel> {
        return this.authHttp.post(`${this.url}/${projectId}/dates/private`, date).map(response => response.json());
    }

    removePrivateDate(projectId: string, groupId: string, id: string): Observable<boolean> {
        return this.authHttp.delete(`${this.url}/${projectId}/dates/private/${groupId}/${id}`).map(response => response.json());
    }
}

export class EventDateModel {
    id: string;
    Title: string;
    Description: string;
    StartDate: Date;
    EndDate: Date;
    ParentEventGroupId: string;
}

export class EventGroupModel {
    id: string;
    Name: string;
    Description: string;
    ColourHex: string;
    ProjectId: string;
}

export class EventGroupModelGrouped {
    GroupingName: string;
    Groups: EventGroupModel;
}

export class EventGroupDatesModel {
    Group: EventGroupModel;
    Dates: EventDateModel[];
}