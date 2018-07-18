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

    twitterGetLogin(projectId: string): Observable<string> {
        return this.authHttp.get(`${this.url}/${projectId}/twitter/getLogin`).map(response => response.json());
    }

    facebookGetLogin(projectId: string): Observable<FacebookOAuthDetails> {
        return this.authHttp.get(`${this.url}/${projectId}/facebook/getLogin`).map(response => response.json());
    }

    facebookRefresh(projectId: string, integrationID: string): Observable<ProjectIntegrationModel> {
        return this.authHttp.get(`${this.url}/${projectId}/facebook/refresh/${integrationID}`).map(response => response.json());
    }

    facebookGetAllIntegrations(projectId: string): Observable<FacebookProjectIntegrationModel[]> {
        return this.authHttp.get(`${this.url}/${projectId}/facebook/getIntegrations`).map(response => response.json());
    }

    linkedInGetLogin(projectId: string): Observable<FacebookOAuthDetails> {
        return this.authHttp.get(`${this.url}/${projectId}/linkedin/getLogin`).map(response => response.json());
    }

    googleGetLogin(projectId: string): Observable<FacebookOAuthDetails> {
        return this.authHttp.get(`${this.url}/${projectId}/google/getLogin`).map(response => response.json());
    }

    pinterestGetLogin(projectId: string): Observable<FacebookOAuthDetails> {
        return this.authHttp.get(`${this.url}/${projectId}/pinterest/getLogin`).map(response => response.json());
    }

    completeCallback(state: string, code: string): Observable<any> {
        return this.authHttp.get(`${this.url}/callback?state=${state}&code=${code}`).map(response => response.json());
    }
}

export class FacebookOAuthDetails {
    state: string;
    url: string;
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
    Wordpress,
    Google
}

export class WordpressProjectIntegrationModel extends ProjectIntegrationModel {
    WebsiteUrl: string;
    Username: string;
    Password: string;
}

export class FacebookProjectIntegrationModel extends ProjectIntegrationModel {
    AccessToken: string;
    TokenType: string;
    ExpiresAt: Date;
    Accounts: FacebookAccountsModel[];
    UserDetails: FacebookUserDetailsModel;
}

export class FacebookAccountsModel {
    id: string;
    name: string;
    accessToken: string;
    category: string;
    permissions: string[];
}

export class FacebookUserDetailsModel {
    name: string;
    id: string;
}

export class WordpressLinkModel {
    BlogPostId: string;
    Url: string;
    LastPublishedContentId: string;
    LastPublishedDate: Date;
    AdminUrl: string;
}

