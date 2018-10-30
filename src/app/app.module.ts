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
import { AppviewsModule } from "./views/appviews/appviews.module";

// App modules/components
import { LayoutsModule } from "./components/common/layouts/layouts.module";
import { AuthService, authHttpServiceFactory } from "services/auth.service";
import { AuthHttp } from "angular2-jwt/angular2-jwt";
import { AuthenticatedGuard, OrganisationAdminGuard } from 'services/security/auth-guard.service';
import { WidgetsModule } from 'app/components/widgets/widgets.module';
import { SuggestionsService } from 'services/suggestions.service';
import { FlowService } from 'services/security/flow.service';
import { PipesModule } from 'app/components/common/pipes/pipes.module';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { LaddaModule } from 'angular2-ladda';
import { SweetAlertService } from 'ng2-sweetalert2';
import { TagInputModule } from 'ngx-chips';
import { QuillEditorModule } from 'ng2-quill-editor';
import { MyDatePickerModule } from 'mydatepicker';
import { A2Edatetimepicker } from 'ng2-eonasdan-datetimepicker';
import { DropzoneModule, DropzoneConfigInterface, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { WelcomeService } from 'services/welcome.service';
import { UserProfileModule } from 'app/modules/userProfileModule/userProfile.module';
import { SharedModule } from 'app/modules/sharedModule/shared.module';
import { OrganisationModule } from 'app/modules/organisationModule/organisation.module';
import { UserService } from 'services/user.service';
import { UserDataService } from 'services/user-data.service';
import { CreatorModule } from 'app/modules/creatorModule/creator.module';
import { CreatorService } from 'services/creator.service';
import { TourService } from 'services/tour.service';
import { environment } from 'environments/environment';
import { AgendaService } from 'services/agenda.service';
import { CouponService } from 'services/coupon.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ContentProjectService } from 'services/content-project.service';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: `${environment.baseApiUrl}/api/images`,
   maxFilesize: 5,
   acceptedFiles: 'image/*'
 };


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    LayoutsModule,
    AppviewsModule,
    WidgetsModule,
    PipesModule,

    UserProfileModule,
    OrganisationModule,
    SharedModule,
    LaddaModule.forRoot({ style: 'expand-right', spinnerSize: 20, spinnerColor: 'white', spinnerLines: 12 }), // For showing progress on buttons
    ToastModule.forRoot(),  // For showing toast messages to user
    TagInputModule,
    MyDatePickerModule,
    A2Edatetimepicker,
    QuillEditorModule,
    DropzoneModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AuthService,
    SuggestionsService,
    FlowService,
    WelcomeService,
    UserService,
    UserDataService,
    ContentProjectService,
    CreatorService,
    AuthenticatedGuard,
    OrganisationAdminGuard,
    MixpanelService,
    SweetAlertService,
    TourService,
    AgendaService,
    CouponService,
    CookieService,

    // Dropzone configuration
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },

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
