import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContentProjectIntegrationService {

    private url: string = environment.baseApiUrl + '/api/ContentProjectIntegration';

    constructor(private authHttp: AuthHttp) {
    }

    getAll(projectId: string): Observable<ProjectIntegrationModel[]> {
        return this.authHttp.get(`${this.url}/${projectId}`).map(response => response.json());
    }

    addWordpressIntegration(projectId: string, integration: WordpressProjectIntegrationModel): Observable<ProjectIntegrationModel> {
        return this.authHttp.post(`${this.url}/${projectId}/wordpress`, integration).map(response => response.json());
    }

    removeIntegration(projectId: string, integrationId: string): Observable<boolean> {
        return this.authHttp.delete(`${this.url}/${projectId}/${integrationId}`).map(response => response.json());
    }

    createWordpressForItem(projectId: string, contentId: string): Observable<WordpressLinkModel> {
        return this.authHttp.post(`${this.url}/${projectId}/wordpress/create/${contentId}`, null).map(response => response.json());
    }

    updateWordpressForItem(projectId: string, contentId: string): Observable<WordpressLinkModel> {
        return this.authHttp.put(`${this.url}/${projectId}/wordpress/create/${contentId}`, null).map(response => response.json());
    }

    deleteWordpressForItem(projectId: string, contentId: string): Observable<boolean> {
        return this.authHttp.delete(`${this.url}/${projectId}/wordpress/create/${contentId}`, null).map(response => response.json());
    }
}

export class ProjectIntegrationModel {
    id: string;
    ProjectId: string;
    Name: string;
    IntegrationType: IntegrationTypes;
}

export enum IntegrationTypes {
    Twitter,
    Facebook,
    FacebookGroup,
    LinkedIn,
    Medium,
    Pinterest,
    Instagram,
    Wordpress
}

export class WordpressProjectIntegrationModel extends ProjectIntegrationModel {
    WebsiteUrl: string;
    Username: string;
    Password: string;
}

export class WordpressLinkModel
{
    BlogPostId: string;
    Url: string;
    LastPublishedContentId: string;
}