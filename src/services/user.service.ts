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

  // Add a support suggestion
  addSuggestion(suggestion: string): Observable<boolean> {
    return this.authHttp.post(`${this.url}/suggestion`, suggestion).map(response => response.json());
  }

  // Get all the users existing support tickets
  getAllSupportTickets(): Observable<UserSupportTicketModel[]> {
    return this.authHttp.get(`${this.url}/support`).map(response => response.json());
  }

  // Add a new support ticket
  addSupportTicket(ticket: UserSupportTicketModel): Observable<UserSupportTicketModel> {
    return this.authHttp.post(`${this.url}/support`, ticket).map(response => response.json());
  }

  // Get a short code to authenticate a mobile application
  getMobileShortCode(): Observable<string> {
    return this.authHttp.get(`${this.url}/mobileSecurity/code`).map(response => response.json());
  }
}


export class UserSettings {
  public Name: string;
  public Email: string;
  public MarketingOptIn: boolean;
  public ShowCreatorOptions: boolean;
  public ShowOrganisationOptions: boolean;
  public SendAFriendCode: string;
}

export class UserSupportTicketModel {
  public Subject: string;
  public Message: string;
  public Created: Date;
}
