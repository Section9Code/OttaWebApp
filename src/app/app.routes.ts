import { Routes } from "@angular/router";

import { Dashboard1Component } from "./views/dashboards/dashboard1.component";
import { Dashboard2Component } from "./views/dashboards/dashboard2.component";
import { Dashboard3Component } from "./views/dashboards/dashboard3.component";
import { Dashboard4Component } from "./views/dashboards/dashboard4.component";
import { Dashboard41Component } from "./views/dashboards/dashboard41.component";
import { Dashboard5Component } from "./views/dashboards/dashboard5.component";

import { StarterViewComponent } from "./views/appviews/starterview.component";
import { LoginComponent } from "./views/appviews/login.component";

import { BlankLayoutComponent } from "./components/common/layouts/blankLayout.component";
import { BasicLayoutComponent } from "./components/common/layouts/basicLayout.component";
import { TopNavigationLayoutComponent } from "./components/common/layouts/topNavigationlayout.component";
import { AuthenticatedGuard } from "services/security/auth-guard.service";
import { CallbackComponent } from "app/views/appviews/callback/callback.component";
import { CalendarViewComponent } from "app/views/appviews/calendarview/calendarview.component";
import { SuggestionsViewComponent } from "app/views/appviews/suggestionsview/suggestionsview.component";
import { WelcomeComponent } from "app/views/appviews/welcome/welcome.component";
import { ProblemComponent } from "app/views/appviews/problem/problem.component";
import { SuggestionCreateViewComponent } from "app/views/appviews/suggestion-create-view/suggestion-create-view.component";
import { SuggestionViewComponent } from "app/views/appviews/suggestion-view/suggestion-view.component";
import { JoinComponent } from "app/views/appviews/join/join.component";
import { InActiveComponent } from "app/views/appviews/in-active/in-active.component";
import { WelcomeToTheTeamComponent } from "app/views/appviews/welcome-to-the-team/welcome-to-the-team.component";
import { VerifyEmailComponent } from "app/views/appviews/verify-email/verify-email.component";
import { SubscriptionErrorComponent } from "./views/appviews/subscription-error/subscription-error.component";
import { OfferComponent } from "./views/appviews/offer/offer.component";
import { MobileAuthComponent } from "./views/appviews/mobile-auth/mobile-auth.component";

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // App views
  {
    path: 'dashboards', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
    children: [
      { path: 'dashboard1', component: Dashboard1Component, canActivate: [AuthenticatedGuard] },
      { path: 'dashboard2', component: Dashboard2Component, canActivate: [AuthenticatedGuard] },
      { path: 'dashboard3', component: Dashboard3Component, canActivate: [AuthenticatedGuard] },
      { path: 'dashboard4', component: Dashboard4Component, canActivate: [AuthenticatedGuard] },
      { path: 'dashboard5', component: Dashboard5Component, canActivate: [AuthenticatedGuard] }
    ]
  },

  {
    path: 'calendars', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
    children: [
      { path: 'month', component: CalendarViewComponent, canActivate: [AuthenticatedGuard] }
    ]
  },

  {
    path: 'suggestions', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
    children: [
      { path: '', component: SuggestionsViewComponent, canActivate: [AuthenticatedGuard] },
      { path: 'create', component: SuggestionCreateViewComponent, canActivate: [AuthenticatedGuard] },
      { path: 'suggestion/:id', component: SuggestionViewComponent, canActivate: [AuthenticatedGuard] }
    ]
  },

  {
    path: '', component: BasicLayoutComponent,
    children: [
      { path: 'home', component: StarterViewComponent, canActivate: [AuthenticatedGuard] },
      { path: 'mobile', component: MobileAuthComponent, canActivate: [AuthenticatedGuard] } // For authenticating a mobile device against a user
    ]
  },

  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },                                         // Main login form
      { path: 'callback', component: CallbackComponent },                                   // For the authentication system to call back into with a user
      { path: 'problem', component: ProblemComponent },                                     // When there was a problem logging in
      { path: 'join', component: JoinComponent },                                           // For when a user wants to join a subscription
      { path: 'offer', component: OfferComponent },                                         // For whent he user joins with an offer code
      { path: 'inactive', component: InActiveComponent },                                   // For whehn a user has been removed from a subscription
      { path: 'subscriptionerror', component: SubscriptionErrorComponent },                 // For when a user can't be joined onto a subscription
      { path: 'welcome', component: WelcomeComponent, canActivate: [AuthenticatedGuard] },  // Welcome message for new users
      { path: 'welcomeToTheTeam', component: WelcomeToTheTeamComponent, canActivate: [AuthenticatedGuard] },  // For welcoming new team members to the system
      { path: 'verifyemail', component: VerifyEmailComponent, canActivate: [AuthenticatedGuard] }
    ]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'home' }
];
