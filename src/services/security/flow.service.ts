import { Injectable } from '@angular/core';
import { AuthHttp } from "angular2-jwt/angular2-jwt";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from "environments/environment";
import { Http } from "@angular/http";
import { JoinData } from 'app/views/appviews/join/join.component';

// Flow control functions for a user
@Injectable()
export class FlowService {
  private url: string = environment.baseApiUrl + '/api/flow';

  constructor(private authHttp: AuthHttp) { }

  // Called when the user logs in and they don't have any joining data associated
  public loginCheck(joinData: JoinData):Observable<FlowControlModel> {
    return this.authHttp.post(this.url + '/loginCheck', joinData).map(response => response.json());
  }

}

export class FlowControlModel
{
  NextPage: string;
  ShowCreatorOptions: boolean;
  ShowOrganisationOptions: boolean;
}

