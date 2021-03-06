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
import { ContentProjectRequeueDetailsLayoutComponent } from './content-project-requeue-details-layout/content-project-requeue-details-layout.component';
import { CimListComponent } from './components/cim/cim-list/cim-list.component';
import { CimSubstitutionsListComponent } from './components/cim/cim-substitutions-list/cim-substitutions-list.component';
import { CimEditorTwitterComponent } from './components/cim/cim-editor-twitter/cim-editor-twitter.component';
import { CimEditorFacebookComponent } from './components/cim/cim-editor-facebook/cim-editor-facebook.component';
import { CimEditorLinkedinComponent } from './components/cim/cim-editor-linkedin/cim-editor-linkedin.component';
import { CimMessagesListComponent } from './components/cim/cim-messages-list/cim-messages-list.component';
import { CimEditorPinterestComponent } from './components/cim/cim-editor-pinterest/cim-editor-pinterest.component';
import { CimEditorMediumComponent } from './components/cim/cim-editor-medium/cim-editor-medium.component';
import { CimListRequeueComponent } from './components/cim/cim-list-requeue/cim-list-requeue.component';
import { RequeueTimeslotsComponent } from './components/requeue-timeslots/requeue-timeslots.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import { CommonModule } from '@angular/common';
import { ContentProjectPersonsaLayoutComponent } from './content-project-personsa-layout/content-project-personsa-layout.component';
import { ContentProjectPersonsaCreateLayoutComponent } from './content-project-personsa-create-layout/content-project-personsa-create-layout.component';
import { ContentPersonaFormComponent } from './components/content-persona-form/content-persona-form.component';
import { PersonaCreateComponent } from '../personaModule/persona-create/persona-create.component';
import { ProjectPersonaService } from './services/project-persona.service';
import { ContentProjectPersonsaEditLayoutComponent } from './content-project-personsa-edit-layout/content-project-personsa-edit-layout.component';
import { SubSuggestComponent } from './components/cim/sub-suggest/sub-suggest.component';


// Routes for this module to be added to the application
const routes: Routes = [
    {
        path: '', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
            // Overview pages (List all projects a user has access to)
            { path: '', component: ContentHomeLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: 'create', component: ContentCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: 'search', component: ContentSearchLayoutComponent, canActivate: [AuthenticatedGuard] },
            {
                // Project pages
                path: ':id', component: ContentProjectLayoutComponent, canActivate: [AuthenticatedGuard],
                children: [
                    { path: '', redirectTo: 'calendar' },
                    { path: 'calendar', component: ContentProjectCalendarLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'items', component: ContentProjectDraftsLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'items/create', component: ContentProjectDraftsCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'items/:id2', component: ContentProjectDraftsUpdateLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'pitches', component: ContentProjectPitchesLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'personas', component: ContentProjectPersonsaLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'personas/create', component: ContentProjectPersonsaCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'personas/:id', component: ContentProjectPersonsaEditLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'events', component: ContentProjectEventsLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'requeue', component: ContentProjectRequeueLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'requeue/:queueId', component: ContentProjectRequeueDetailsLayoutComponent, canActivate: [AuthenticatedGuard] },
                    { path: 'settings', component: ContentProjectSettingsLayoutComponent, canActivate: [AuthenticatedGuard, OrganisationAdminGuard] },
                ]
            }
        ]
    }
];

// User Profile Feature Module
@NgModule({
    imports: [
        CommonModule,
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
        ContentProjectRequeueDetailsLayoutComponent,

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
        ContentItemMessageFacebookFormComponent,
        CimListComponent,
        CimSubstitutionsListComponent,
        CimEditorTwitterComponent,
        CimEditorFacebookComponent,
        CimEditorLinkedinComponent,
        CimMessagesListComponent,
        CimEditorPinterestComponent,
        CimEditorMediumComponent,
        CimListRequeueComponent,
        RequeueTimeslotsComponent,
        ImageListComponent,
        ContentProjectPersonsaLayoutComponent,
        ContentProjectPersonsaCreateLayoutComponent,
        ContentPersonaFormComponent,
        ContentProjectPersonsaEditLayoutComponent,
        SubSuggestComponent
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
        RequeueService,
        ProjectPersonaService
    ],
})
export class ContentModule {
}
