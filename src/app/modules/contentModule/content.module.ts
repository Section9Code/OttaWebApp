import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { LayoutsModule } from 'app/components/common/layouts/layouts.module';
import { BasicLayoutComponent } from 'app/components/common/layouts/basicLayout.component';
import { AuthenticatedGuard } from 'services/security/auth-guard.service';
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


// Routes for this module to be added to the application
const routes: Routes = [
    {
        path: 'content', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
            { path: '', component: ContentHomeLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: 'create', component: ContentCreateLayoutComponent, canActivate: [AuthenticatedGuard] },
            { path: ':id', component: ContentProjectLayoutComponent, canActivate: [AuthenticatedGuard] }
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
        // Components
        ContentProjectListComponent
    ],
    providers: [
        MixpanelService,
        ContentProjectService
    ],
})
export class ContentModule {
}
