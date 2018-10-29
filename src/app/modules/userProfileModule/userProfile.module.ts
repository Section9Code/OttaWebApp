import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LayoutsModule } from 'app/components/common/layouts/layouts.module';
import { Routes, RouterModule } from '@angular/router';
import { BasicLayoutComponent } from 'app/components/common/layouts/basicLayout.component';
import { AuthenticatedGuard } from 'services/security/auth-guard.service';
import { ProfileComponent } from 'app/modules/userProfileModule/profile/profile.component';
import { LaddaModule } from 'angular2-ladda';
import { ToastModule } from 'ng2-toastr';
import { SharedModule } from 'app/modules/sharedModule/shared.module';
import { CommonModule } from '@angular/common';

// Routes the User Profile Module Adds to the application
const routes: Routes = [
    {
        path: 'profile', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
          { path: '', component: ProfileComponent, canActivate: [AuthenticatedGuard] }
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
        ToastModule,
        SharedModule
    ],
    exports: [
        RouterModule,
        ProfileComponent
    ],
    declarations: [
        ProfileComponent
    ],
    providers: [],
})
export class UserProfileModule {}
