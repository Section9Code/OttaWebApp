import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from "@angular/router";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ROUTES } from "./app.routes";
import { AppComponent } from './app.component';

// App views
import { DashboardsModule } from "./views/dashboards/dashboards.module";
import { AppviewsModule } from "./views/appviews/appviews.module";

// App modules/components
import { LayoutsModule } from "./components/common/layouts/layouts.module";
import { AuthService, authHttpServiceFactory } from "services/auth.service";
import { AuthHttp } from "angular2-jwt/angular2-jwt";
import { AuthenticatedGuard, OrganisationAdminGuard } from "services/security/auth-guard.service";
import { WidgetsModule } from "app/components/widgets/widgets.module";
import { SuggestionsService } from "services/suggestions.service";
import { FlowService } from "services/security/flow.service";
import { PipesModule } from "app/components/common/pipes/pipes.module";
import { MixpanelService } from "services/mixpanel.service";
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { LaddaModule } from 'angular2-ladda';
import { SweetAlertService } from 'ng2-sweetalert2';
import { TagInputModule } from 'ngx-chips';
import { WelcomeService } from 'services/welcome.service';

import { UserProfileModule } from 'app/modules/userProfileModule/userProfile.module';
import { PersonaModule } from 'app/modules/personaModule/persona.module';
import { SharedModule } from 'app/modules/sharedModule/shared.module';
import { OrganisationModule } from 'app/modules/organisationModule/organisation.module';
import { UserService } from 'services/user.service';
import { UserDataService } from 'services/user-data.service';
import { CreatorModule } from 'app/modules/creatorModule/creator.module';
import { CreatorService } from 'services/creator.service';
import { ContentModule } from 'app/modules/contentModule/content.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    DashboardsModule,
    LayoutsModule,
    AppviewsModule,
    WidgetsModule,
    PipesModule,
    
    UserProfileModule,
    PersonaModule,
    OrganisationModule,
    CreatorModule,
    ContentModule,
    SharedModule,

    LaddaModule.forRoot({ style: "expand-right", spinnerSize: 20, spinnerColor: "white", spinnerLines: 12 }), // For showing progess on buttons
    ToastModule.forRoot(),  // For showing toast messages to user
    TagInputModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AuthService,
    SuggestionsService,
    FlowService,
    WelcomeService,
    UserService,
    UserDataService,
    CreatorService,
    AuthenticatedGuard,
    OrganisationAdminGuard,
    MixpanelService,
    SweetAlertService, 
    // Create the AuthHttp service for using Auth0 JWT tokens to make calls to the back end
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
