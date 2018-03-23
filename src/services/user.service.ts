import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private url: string = environment.baseApiUrl + '/api/user';
  constructor(private authHttp: AuthHttp) { }

  // Get the users settings
  getSettings(): Observable<UserSettings> {
    return this.authHttp.get(this.url).map(response => response.json());
  }

  // Update the users settings
  updateSettings(data: UserSettings): Observable<boolean> {
    return this.authHttp.post(this.url, data).map(response => response.json());
  }

  addSuggestion(suggestion: string): Observable<boolean> {
    return this.authHttp.post(`${this.url}/AddSuggestion`, suggestion).map(response => response.json());
  }
}


export class UserSettings {
  public Name: string;
  public Email: string;
  public MarketingOptIn: boolean;
  public ShowCreatorOptions: boolean;
  public ShowOrganisationOptions: boolean;
}
