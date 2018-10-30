import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { StarterViewComponent } from './starterview.component';
import { LoginComponent } from './login.component';
import { PeityModule } from '../../components/charts/peity';
import { SparklineModule } from '../../components/charts/sparkline';
import { CallbackComponent } from './callback/callback.component';
import { WidgetsModule } from 'app/components/widgets/widgets.module';
import { CalendarViewComponent } from 'app/views/appviews/calendarview/calendarview.component';
import { CalendarComponent } from 'ap-angular2-fullcalendar/src/calendar/calendar';
import { WelcomeComponent } from 'app/views/appviews/welcome/welcome.component';
import { ProblemComponent } from 'app/views/appviews/problem/problem.component';
import { PipesModule } from 'app/components/common/pipes/pipes.module';
import { LaddaModule } from 'angular2-ladda/module/module';
import { JoinComponent } from 'app/views/appviews/join/join.component';
import { InActiveComponent } from 'app/views/appviews/in-active/in-active.component';
import { WelcomeToTheTeamComponent } from 'app/views/appviews/welcome-to-the-team/welcome-to-the-team.component';
import { VerifyEmailComponent } from 'app/views/appviews/verify-email/verify-email.component';
import { SubscriptionErrorComponent } from './subscription-error/subscription-error.component';
import { SharedModule } from '../../modules/sharedModule/shared.module';
import { InviteAfriendComponent } from './invite-afriend/invite-afriend.component';
import { AgendaComponent } from './agenda/agenda.component';
import { OfferComponent } from './offer/offer.component';
import { MobileAuthComponent } from './mobile-auth/mobile-auth.component';
import { IntegrationOauthComponent } from './integration-oauth/integration-oauth.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    StarterViewComponent,
    LoginComponent,
    CallbackComponent,
    CalendarViewComponent,
    CalendarComponent,
    WelcomeComponent,
    ProblemComponent,
    JoinComponent,
    InActiveComponent,
    WelcomeToTheTeamComponent,
    VerifyEmailComponent,
    SubscriptionErrorComponent,
    InviteAfriendComponent,
    AgendaComponent,
    OfferComponent,
    MobileAuthComponent,
    IntegrationOauthComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    WidgetsModule,
    PipesModule,
    LaddaModule,
    SharedModule
  ],
  exports: [
    StarterViewComponent,
    LoginComponent,
    CallbackComponent
  ],
})

export class AppviewsModule {
}
