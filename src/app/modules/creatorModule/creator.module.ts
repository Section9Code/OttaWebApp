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
import { CreatorOverviewComponent } from 'app/modules/creatorModule/creator-overview/creator-overview.component';
import { CreatorDetailsComponent } from 'app/modules/creatorModule/creator-details/creator-details.component';
import { CreatorProfileListComponent } from 'app/modules/creatorModule/creator-profile-list/creator-profile-list.component';
import { CommonModule } from '@angular/common';

// Routes for this module to be added to the application
const routes: Routes = [
    {
        path: 'creator', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
            { path: '', component: CreatorOverviewComponent, canActivate: [AuthenticatedGuard] }
        ]
    }
];

// User Profile Feature Module
@NgModule({
    imports: [
        CommonModule,
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
        RouterModule,
        CreatorOverviewComponent,
        CreatorDetailsComponent,
        CreatorProfileListComponent
    ],
    declarations: [
        CreatorOverviewComponent,
        CreatorDetailsComponent,
        CreatorProfileListComponent
    ],
    providers: [
        MixpanelService
    ],
})
export class CreatorModule {
}
