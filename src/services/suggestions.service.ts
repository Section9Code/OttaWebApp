import { Injectable } from '@angular/core';
import { AuthHttp } from "angular2-jwt/angular2-jwt";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from "environments/environment";


// Service for interacting with suggestions, their comments and votes
@Injectable()
export class SuggestionsService {
  private url: string = environment.baseApiUrl + '/api/suggestions';

  constructor(private authHttp: AuthHttp) { }

  getAll(): Observable<SuggestionReduced[]> {
    return this.authHttp.get(this.url).map(response => response.json());
  }

  getSingle(id: string): Observable<Suggestion> {
    return this.authHttp.get(`${this.url}/${id}`).map(response => response.json());
  }

  create(suggestion: CreateSuggestion): Observable<any> {
    return this.authHttp.post(this.url, suggestion).map(response => response.json());
  }

  remove(id:string): Observable<boolean>{
    return this.authHttp.delete(`${this.url}/${id}`, {}).map(response => response.json());
  }

  upVote(id: string): Observable<VotingSuccess> {
    return this.authHttp.post(`${this.url}/${id}/upvote`, {}).map(response => response.json());
  }

  downVote(id: string): Observable<VotingSuccess> {
    return this.authHttp.post(`${this.url}/${id}/downvote`, {}).map(response => response.json());
  }

  addComment(id: string, newComment: string): Observable<SuggestionComment> {
    return this.authHttp.post(`${this.url}/${id}/addComment?message=${newComment}`, {} ).map(response => response.json());
  }

  removeComment(id: string, commentId: string): Observable<boolean> {
    return this.authHttp.delete(`${this.url}/${id}/removeComment?commentId=${commentId}`, {} ).map(response => response.json());
  }
}

export class SuggestionReduced {
  public id: string;
  public Title: string;
  public Score: number;
  public Description: string;
  public Created: number;
  public CreatorName: string;
  public CreatorProfileImage: string;
  public Comments: any[];
}

export class Suggestion {
  id: string;
  Title: string;
  Description: string;
  Created: number;
  Creator: CreatorInfo;
  Closed: boolean;
  Tags: string[];
  Comments: SuggestionComment[];
}

export class SuggestionComment {
  CommentId: string;
  Created: number;
  CreatorInfo: CreatorInfo;
  Message: string;
  Moderated: boolean;
  ModerationReason: string;
  SuggestionComment: SuggestionComment[];
}

export class CreatorInfo {
  CreatorId: string;
  CreatorName: string;
  CreatorProfileImage: string;
}

export class VotingSuccess {
  public Success: boolean;
}

export class CreateSuggestion {
  public title: string;
  public description: string;
}
