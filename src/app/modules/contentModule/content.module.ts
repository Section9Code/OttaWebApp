import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ContentProjectDraftsUpdateLayoutComponent } from 'app/modules/contentModule/content-project-drafts-update-layout/content-project-drafts-update-layout.component';
import { ContentItemTypeListComponent } from 'app/modules/contentModule/components/content-item-type-list/content-item-type-list.component';
import { ContentItemTypeService } from 'services/content-item-type.service';
import { ContentItemTypeLabelComponent } from 'app/modules/contentModule/components/content-item-type-label/content-item-type-label.component';
import { MyDatePickerModule } from 'mydatepicker';
import { OttaCommentComponent } from 'app/modules/sharedModule/otta-comment/otta-comment.component';
import { TimeAgoPipe } from 'app/components/common/pipes/timeAgo.pipe';
import { CommentService } from 'services/comment.service';
import { ContentCalendarComponent } from './components/content-calendar/content-calendar.component';
import { ContentItemContentService } from 'services/content-item-content.service';
import { EventService } from 'services/event.service';
import { ContentEventsComponent } from './components/content-events/content-events.component';
import { ContentProjectIntegrationService } from 'services/ContentProjectIntegration.service';
import { ContentProjectIntegrationsComponent } from './components/content-project-integrations/content-project-integrations.component';
import { ContentItemMessagesComponent } from './components/content-item-messages/content-item-messages.component';
import { ContentItemMessageTwitterFormComponent } from './components/content-item-message-twitter-form/content-item-message-twitter-form.component';
import { ContentItemFilesComponent } from './components/content-item-files/content-item-files.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ContentItemMessageTwitterPreviewComponent } from './components/content-item-message-twitter-preview/content-item-message-twitter-preview.component';
import { ContentSearchLayoutComponent } from './content-search-layout/content-search-layout.component';
import { QuillEditorModule } from 'ng2-quill-editor';
import { ContentItemMessageFacebookFormComponent } from './components/content-item-message-facebook-form/content-item-message-facebook-form.component';
import { RequeueService } from 'services/requeue.service';
import { ContentProjectRequeueLayoutComponent } from './content-project-requeue-layout/content-project-requeue-layout.component';


// Routes for this module to be added to the application
const routes: Routes = [
    {
        path: 'content', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
            // Overview pages (List all projects a user has access to)
            { path: '', component: ContentHomeLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: 'create', component: ContentCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: 'search', component: ContentSearchLayoutComponent, canActivate: [AuthenticatedGuard] },
            {
                // Project pages
                path: ':id', component: ContentProjectLayoutComponent, canActivate: [AuthenticatedGuard],
                children: [
                    { path: '', component: ContentProjectCalendarLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'items', component: ContentProjectDraftsLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'items/create', component: ContentProjectDraftsCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'items/:id2', component: ContentProjectDraftsUpdateLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'pitches', component: ContentProjectPitchesLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'events', component: ContentProjectEventsLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'requeue', component: ContentProjectRequeueLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'settings', component: ContentProjectSettingsLayoutComponent, canActivate: [AuthenticatedGuard, OrganisationAdminGuard] },
                ]
            }
        ]
    }
];

// User Profile Feature Module
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        LayoutsModule,
        RouterModule.forChild(routes),
        LaddaModule,
        TagInputModule,
        ToastModule,
        SharedModule,
        QuillEditorModule,
        MyDatePickerModule,
        DropzoneModule
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
        ContentProjectDraftsUpdateLayoutComponent,
        ContentProjectIntegrationsComponent,
        ContentProjectRequeueLayoutComponent,

        // Components
        ContentProjectListComponent,
        ContentItemDetailsComponent,
        ContentItemTypeListComponent,
        ContentItemTypeLabelComponent,
        ContentCalendarComponent,
        ContentEventsComponent,
        ContentItemMessagesComponent,
        ContentItemMessageTwitterFormComponent,
        ContentItemFilesComponent,
        ContentItemMessageTwitterPreviewComponent,
        ContentSearchLayoutComponent,
        ContentItemMessageFacebookFormComponent
    ],
    providers: [
        MixpanelService,
        ContentProjectService,
        ContentItemService,
        ContentItemTypeService,
        ContentProjectShareService,
        CommentService,
        ContentItemContentService,
        EventService,
        ContentProjectIntegrationService,
        RequeueService
    ],
})
export class ContentModule {
}
