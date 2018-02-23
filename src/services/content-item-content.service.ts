import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { CreatorInfo } from './suggestions.service';

@Injectable()
export class ContentItemContentService {
    private url: string = environment.baseApiUrl + '/api/ContentItemContent';

    constructor(private authHttp: AuthHttp) {
    }

    getLatestContent(contentItemId: string): Observable<ContentItemContentModel> {
        return this.authHttp.get(`${this.url}/${contentItemId}`).map(response => response.json());
    }

    getAllContent(contentItemId: string): Observable<ContentItemContentModel[]> {
        return this.authHttp.get(`${this.url}/${contentItemId}/all`).map(response => response.json());
    }

    addContent(content: ContentItemContentModel): Observable<ContentItemContentModel> {
        return this.authHttp.post(`${this.url}/${content.ParentContentItemId}`, content).map(response => response.json());
    }
}

export class ContentItemContentModel {
    id: string;
    Content: string;
    ParentContentItemId: string;
    CreatorAuthId: string;
    Creator: CreatorInfo;
    Created: Date;
}
