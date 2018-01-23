import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContentProjectService {
    private url: string = environment.baseApiUrl + '/api/content';

    constructor(private authHttp: AuthHttp) {
    }

    getProjects(): Observable<ContentProjectModel[]> {
        return this.authHttp.get(this.url).map(response => response.json());
    }

    getProject(id: string): Observable<ContentProjectModel> {
        return this.authHttp.get(`${this.url}/${id}`).map(response => response.json());
    };

    createProject(project: ContentProjectModel): Observable<ContentProjectModel> {
        return this.authHttp.post(this.url, project).map(response => response.json());
    }
}

export class ContentProjectModel {
    Title: string;
    Description: string;
    Created: Date;
    CreatedBy: string;
}