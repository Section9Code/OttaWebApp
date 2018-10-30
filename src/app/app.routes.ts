import { Routes } from "@angular/router";

import { StarterViewComponent } from "./views/appviews/starterview.component";
import { LoginComponent } from "./views/appviews/login.component";

import { BlankLayoutComponent } from "./components/common/layouts/blankLayout.component";
import { BasicLayoutComponent } from "./components/common/layouts/basicLayout.component";
import { AuthenticatedGuard } from "services/security/auth-guard.service";
import { CallbackComponent } from "app/views/appviews/callback/callback.component";
import { WelcomeComponent } from "app/views/appviews/welcome/welcome.component";
import { ProblemComponent } from "app/views/appviews/problem/problem.component";
import { JoinComponent } from "app/views/appviews/join/join.component";
import { InActiveComponent } from "app/views/appviews/in-active/in-active.component";
import { WelcomeToTheTeamComponent } from "app/views/appviews/welcome-to-the-team/welcome-to-the-team.component";
import { VerifyEmailComponent } from "app/views/appviews/verify-email/verify-email.component";
import { SubscriptionErrorComponent } from "./views/appviews/subscription-error/subscription-error.component";
import { OfferComponent } from "./views/appviews/offer/offer.component";
import { MobileAuthComponent } from "./views/appviews/mobile-auth/mobile-auth.component";
import { IntegrationOauthComponent } from "./views/appviews/integration-oauth/integration-oauth.component";

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Personas
  { path: 'personas', loadChildren: './modules/personaModule/persona.module#PersonaModule' },

  // Support
  { path: 'support', loadChildren: './modules/supportModule/support.module#SupportModule' },

  // Content
  { path: 'content', loadChildren: './modules/contentModule/content.module#ContentModule' },

  // Suggestions
  { path: 'suggestions', loadChildren: './modules/suggestionModule/suggestion.module#SuggestionModule' },

  // Routs with full layouts
  {
    path: '', component: BasicLayoutComponent,
    children: [
      { path: 'home', component: StarterViewComponent, canActivate: [AuthenticatedGuard] },
      { path: 'mobile', component: MobileAuthComponent, canActivate: [AuthenticatedGuard] } // For authenticating a mobile device against a user
    ]
  },

  // Routes with no layouts
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },                                         // Main login form
      { path: 'callback', component: CallbackComponent },                                   // For the authentication system to call back into with a user
      { path: 'integrationCallback', component: IntegrationOauthComponent },
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
