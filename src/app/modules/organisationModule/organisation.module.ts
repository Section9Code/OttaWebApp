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
import { SweetAlertService } from 'ng2-sweetalert2';

import { OrganisationOverviewComponent } from 'app/modules/organisationModule/organisation-overview/organisation-overview.component';
import { OrganisationService } from 'services/organisation.service';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { PlanListComponent } from './components/plan-list/plan-list.component';

// Routes for this module to be added to the application
const routes: Routes = [
    {
        path: 'organisation', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
            { path: '', component: OrganisationOverviewComponent, canActivate: [AuthenticatedGuard] }
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
        OrganisationOverviewComponent,
    ],
    declarations: [
        OrganisationOverviewComponent,
        SubscriptionComponent,
        PlanListComponent
    ],
    providers: [
        MixpanelService,
        SweetAlertService,
        OrganisationService
    ],
})
export class OrganisationModule {
}
