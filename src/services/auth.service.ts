import { Injectable } from '@angular/core';
import { Http, RequestOptions } from "@angular/http";
import { AuthHttp, AuthConfig } from 'angular2-jwt'
import * as auth0 from 'auth0-js';
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { FlowService } from "services/security/flow.service";
import { MixpanelService } from "services/mixpanel.service";
import { JoinData } from 'app/views/appviews/join/join.component';
import { UserDataService } from 'services/user-data.service';
import { AnalyticsService } from './analytics.service';


// Services for interacting with Auth0
@Injectable()
export class AuthService {

  private authObject = new auth0.WebAuth({
    clientID: environment.authConfig.clientId,
    domain: environment.authConfig.domain,
    responseType: 'token id_token',
    redirectUri: environment.authConfig.redirectUri,
    scope: 'openid name email profile'
  });

  // The current users profile information
  public userProfile: Auth0Profile;

  constructor(public router: Router, private flowSvc: FlowService, private mixpanel: MixpanelService, private analytics: AnalyticsService) { }

  // Log into the system
  public login(): void {
    this.authObject.authorize({ mode: 'login' });
  }

  public signup(): void {
    this.authObject.authorize({ mode: 'signUp' });
  }

  // Call back for when a user is authenticated
  public handleAuthentication(): void {
    this.authObject.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // User has logged in
        window.location.hash = '';
        this.setSession(authResult);

        // Load the users profile into the tracking system
        this.getProfile(() => {
          this.mixpanel.TrackProfile(this.userProfile);
          this.analytics.AssignUser(this.userProfile.sub);
        });

        // User flow control to decide where to send the user next now they have logged in
        console.log('Checking user', this.userProfile);

        // Get any join data that may have been supplied
        let joinData: JoinData = JSON.parse(localStorage.getItem('joinData'));
        this.flowSvc.loginCheck(joinData).subscribe(
          response => {
            // The flow control will tell the app where to send the user next
            localStorage.removeItem('joinData');

            // Send the user to the next page
            this.router.navigate([response.NextPage]);
          },
          error => {
            // Unable to talk to the flow control api
            console.log('Error occurred while talking to flow control api', error);
            this.logout();
            this.router.navigate(['/problem']);
          }
        );




      } else if (err) {
        // An unknown error occurred
        console.log(err);
        this.router.navigate(['/problem']);
      }
    });
  }

  // Set the users sesstion in the browers local storage
  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  // Log out of the system
  public logout(redirectBackToLogin: boolean = true): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    if (redirectBackToLogin) {
      this.router.navigate(['/login']);
    }
  }

  // Is the current user authenticated
  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public currentUserAuthId(): string {
    return localStorage.getItem("AuthId");
  }
  
  // Get the access token used to talk to the API
  public getAccessToken(): string {
    return localStorage.getItem('access_token');
  }

  // Get the current users profile
  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.authObject.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        // Store some useful user information
        localStorage.setItem("AuthId", profile.sub);
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }
}

// JWT authentication function
// This sets the JWT tokens correctly when a call is made to an outside service
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('id_token'))
  }), http, options);
}

// Profile information about the current user
export class Auth0Profile {
  email: string;
  email_verified: boolean;
  family_name: string;
  gender: string;
  given_name: string;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}