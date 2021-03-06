import { Injectable } from '@angular/core';
import { AuthService, Auth0Profile } from "services/auth.service";
import { environment } from 'environments/environment';

declare var mixpanel: any;

// Service for interacting with Mixpanel for tracking the users actions
@Injectable()
export class MixpanelService {

  constructor(
  ) { }

  // Track an event into Mixpanel
  public Track(event: MixpanelEvent, properties?: any) {
    // Don't track if the environment isn't production
    if (!environment.production) { return; };

    var eventName = this.GetEventName(event);
    if (properties) {
      console.log('Mixpanel - Track event with properties:', eventName);
      mixpanel.track(eventName, properties);
    }
    else {
      console.log('Mixpanel - Track event:', eventName);
      mixpanel.track(eventName);
    }
  }

  // Track and event into mixpanel with an action
  public TrackAction(event: MixpanelEvent, ActionName: string) {
    this.Track(event, { Action: ActionName });
  }

  // Get the name of the event to send to mixpanel from the enum of events
  private GetEventName(event: MixpanelEvent): string {
    var name = MixpanelEvent[event];
    name = name.replace(/_/g, ' ');
    return name;
  }

  // Track a profile
  // Is given the ID token from authentication
  public TrackProfile(profile: Auth0Profile) {
    // Don't track if the environment isn't production
    if (!environment.production) { return; };

    console.log('Mixpanel - Track profile', profile);
    mixpanel.identify(profile.sub);
    mixpanel.people.set({
      '$first_name': profile.given_name,
      '$last_name': profile.family_name,
      //"$created": profile.updated_at,
      '$email': profile.email
    });
  }

  public TrackError(message: string, error?: any) {
    // Don't track if the environment isn't production
    if (!environment.production) { return; };

    console.log('Mixpanel - Error');
    mixpanel.track('Error', { Message: message, Details: error });
  }

}

export enum MixpanelEvent {
    Login,
    Welcome,
    WelcomeToTheTeam,
    WelcomeComplete,
    Home,
    Join,
    Signup,
    Signup_with_option,
    Offer,
    Added_Suggestion,
    // Suggestions
    View_all_suggestions,
    View_single_suggestion,
    Up_vote_suggestion,
    Down_vote_suggestion,
    Create_Suggestion,
    Remove_Suggestion,
    View_Suggestion,
    Add_Comment_To_Suggestion,
    Remove_Comment_From_Suggestion,
    // Personas
    View_all_personas,
    View_single_personas,
    Create_persona,
    Update_persona,
    Remove_persona,
    // Organisation admin
    View_organisation_admin,
    Update_subscription,
    Cancel_subscription,
    Cancel_subscription_confirmed,
    Invite_user,
    Invite_user_confirmed,
    Invite_user_cancelled,
    // User profile
    UserProfile_View,
    UserProfile_Update,
    // Content
    ContentHome,
    Content_Create_Project,
    Content_See_Project,
    Content_Remove_Project,
    // Content Drafts
    Content_Draft_View,
    Content_Draft_Created,
    // Others
    Button_click,
    Error,
    NewAccountCreated
}