import { Injectable } from '@angular/core';
import { CreatorInfo } from 'services/suggestions.service';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environments/environment';

@Injectable()
export class CommentService {
    private url: string = environment.baseApiUrl + '/api/comment';

    constructor(private authHttp: AuthHttp) {
    }

    getComments(organisationId: string, projectId: string): Observable<CommentGroup> {
        return this.authHttp.get(`${this.url}/${organisationId}/${projectId}`).map(response => response.json());
    }

    addComments(organisationId: string, projectId: string, comment: Comment): Observable<CommentGroup> {
        return this.authHttp.post(`${this.url}/${organisationId}/${projectId}`, comment).map(response => response.json());
    }

    deleteComments(organisationId: string, projectId: string, commentId: string): Observable<CommentGroup> {
        return this.authHttp.get(`${this.url}/${organisationId}/${projectId}/${commentId}`).map(response => response.json());
    }
}

export class CommentGroup {
    ParentId: string;
    Comments: Comment[];
    IsLocked: boolean;
}

export class Comment {
    Id: string;
    Message: string;
    CreatorAuthId: string;
    Creator: CreatorInfo;
    Created: Date;
}
