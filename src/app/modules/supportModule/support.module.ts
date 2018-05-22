import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LayoutsModule } from '../../components/common/layouts/layouts.module';
import { SharedModule } from '../sharedModule/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { TagInputModule } from 'ngx-chips';
import { ToastModule } from 'ng2-toastr';
import { BasicLayoutComponent } from 'app/components/common/layouts/basicLayout.component';
import { AuthenticatedGuard } from 'services/security/auth-guard.service';
import { SupportIndexLayoutComponent } from './layouts/support-index-layout/support-index-layout.component';
import { SupportMainLayoutComponent } from './layouts/support-main-layout/support-main-layout.component';
import { SupportTicketListComponent } from './components/support-ticket-list/support-ticket-list.component';

// Routes for this module to be added to the application
const supportRoutes: Routes = [
  {
    path: 'support', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
    children: [
      {
        path: '', component: SupportIndexLayoutComponent, canActivate: [AuthenticatedGuard], 
        children: [
          { path: '', component: SupportMainLayoutComponent, canActivate: [AuthenticatedGuard] }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forChild(supportRoutes),
    FormsModule,
    HttpModule,
    LayoutsModule,
    LaddaModule,
    TagInputModule,
    ToastModule,
    SharedModule
  ],
  declarations: [
    SupportIndexLayoutComponent,
    SupportMainLayoutComponent,
    SupportTicketListComponent
  ]
})
export class SupportModule { }
