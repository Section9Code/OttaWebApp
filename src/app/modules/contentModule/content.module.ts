import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { LayoutsModule } from 'app/components/common/layouts/layouts.module';
import { BasicLayoutComponent } from 'app/components/common/layouts/basicLayout.component';
import { AuthenticatedGuard, OrganisationAdminGuard } from 'services/security/auth-guard.service';
import { LaddaModule } from 'angular2-ladda';
import { ToastModule } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { SharedModule } from 'app/modules/sharedModule/shared.module';
import { TagInputModule } from 'ngx-chips';
import { ImagesService } from 'services/images.service';
import { ContentHomeLayoutComponent } from 'app/modules/contentModule/content-home-layout/content-home-layout.component';
import { ContentProjectListComponent } from 'app/modules/contentModule/components/content-project-list/content-project-list.component';
import { ContentProjectService } from 'services/content-project.service';
import { ContentCreateLayoutComponent } from 'app/modules/contentModule/content-create-layout/content-create-layout.component';
import { ContentProjectLayoutComponent } from 'app/modules/contentModule/content-project-layout/content-project-layout.component';
import { ContentProjectCalendarLayoutComponent } from 'app/modules/contentModule/content-project-calendar-layout/content-project-calendar-layout.component';
import { ContentProjectDraftsLayoutComponent } from 'app/modules/contentModule/content-project-drafts-layout/content-project-drafts-layout.component';
import { ContentProjectPitchesLayoutComponent } from 'app/modules/contentModule/content-project-pitches-layout/content-project-pitches-layout.component';
import { ContentProjectEventsLayoutComponent } from 'app/modules/contentModule/content-project-events-layout/content-project-events-layout.component';
import { ContentProjectSettingsLayoutComponent } from 'app/modules/contentModule/content-project-settings-layout/content-project-settings-layout.component';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentProjectDraftsCreateLayoutComponent } from 'app/modules/contentModule/content-project-drafts-create-layout/content-project-drafts-create-layout.component';
import { ContentItemService } from 'services/content-item.service';
import { ContentItemDetailsComponent } from 'app/modules/contentModule/components/content-item-details/content-item-details.component';


// Routes for this module to be added to the application
const routes: Routes = [
    {
        path: 'content', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
            { path: '', component: ContentHomeLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: 'create', component: ContentCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: ':id', component: ContentProjectLayoutComponent, canActivate: [AuthenticatedGuard], 
            children: [
                {path: '', component: ContentProjectCalendarLayoutComponent, canActivate: [AuthenticatedGuard] },
                {path: 'drafts', component: ContentProjectDraftsLayoutComponent, canActivate: [AuthenticatedGuard] },
                {path: 'drafts/create', component: ContentProjectDraftsCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
                {path: 'pitches', component: ContentProjectPitchesLayoutComponent, canActivate: [AuthenticatedGuard] },
                {path: 'events', component: ContentProjectEventsLayoutComponent, canActivate: [AuthenticatedGuard] },
                {path: 'settings', component: ContentProjectSettingsLayoutComponent, canActivate: [AuthenticatedGuard, OrganisationAdminGuard]},
            ]}
        ]
    }
];

// User Profile Feature Module 
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        LayoutsModule,
        RouterModule.forChild(routes),
        LaddaModule,
        TagInputModule,
        ToastModule,
        SharedModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        // Layouts
        ContentHomeLayoutComponent,
        ContentCreateLayoutComponent,
        ContentProjectLayoutComponent,
        ContentProjectCalendarLayoutComponent,
        ContentProjectDraftsLayoutComponent,
        ContentProjectPitchesLayoutComponent,
        ContentProjectEventsLayoutComponent,
        ContentProjectSettingsLayoutComponent,
        ContentProjectDraftsCreateLayoutComponent,

        // Components
        ContentProjectListComponent,
        ContentItemDetailsComponent
    ],
    providers: [
        MixpanelService,
        ContentProjectService,
        ContentItemService,
        ContentProjectShareService
    ],
})
export class ContentModule {
}
