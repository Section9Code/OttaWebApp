import { Injectable } from '@angular/core';
import { AuthHttp } from "angular2-jwt/angular2-jwt";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from "environments/environment";


// Service for when the user first logs into the system to collect additional information about them
@Injectable()
export class WelcomeService {
  private url: string = environment.baseApiUrl + '/api/welcome';

  constructor(private authHttp: AuthHttp) { }

  getData(): Observable<WelcomeModel>{
    return this.authHttp.get(this.url).map(response => response.json());
  }

  updateData(data:WelcomeModel): Observable<boolean>{
    return this.authHttp.post(this.url, data).map(response => response.json());
  }
}

// Model the service uses to talk to the API
export class WelcomeModel {
  public OrganisationName: string;
  public Name: string;
  public Email: string;
  public MarketingOptIn: boolean;
  public ShowCreatorOptions: boolean;
  public ShowOrganisationOptions: boolean;
}