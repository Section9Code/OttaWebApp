import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CreatorService {
  private url: string = environment.baseApiUrl + '/api/creator';

  constructor(private authHttp: AuthHttp) {
  }

  getCreator(): Observable<CreatorModel> {
    return this.authHttp.get(this.url).map(response => response.json());
  }

  updateCreator(data: CreatorModel): Observable<CreatorModel> {
    return this.authHttp.post(this.url, data).map(response => response.json());
  }
}

export class CreatorModel {
  ApprovalStatus: CreatorModelStatus;
  IsActive: boolean;

  WebsiteUrl: string;

  ExamplesOfWork1: string;
  ExamplesOfWork2: string;
  ExamplesOfWork3: string;

  TwitterId: string;
  FacebookUrl: string;
  InstagramId: string;
  LinkedInId: string;
}

export enum CreatorModelStatus
{
  New,
  AwaitingApproval,
  Approved,
  Denied,
  Resubmit
}