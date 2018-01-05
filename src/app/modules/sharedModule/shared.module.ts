import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from 'app/modules/sharedModule/loading-spinner/loading-spinner.component';
import { StripeButtonComponent } from 'app/modules/sharedModule/stripe/stripe-button/stripe-button.component';
import { LaddaModule } from 'angular2-ladda';
import { PanelLoadingSpinnerComponent } from 'app/modules/sharedModule/panel-loading-spinner/panel-loading-spinner.component';
import { OttaPanelComponent } from 'app/modules/sharedModule/otta-panel/otta-panel.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

// User Profile Feature Module 
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        LaddaModule
    ],
    exports: [
        LoadingSpinnerComponent,
        StripeButtonComponent,
        PanelLoadingSpinnerComponent,
        OttaPanelComponent
    ],
    declarations: [
        LoadingSpinnerComponent,
        StripeButtonComponent,
        PanelLoadingSpinnerComponent,
        OttaPanelComponent
    ],
    providers: [
    ],
})
export class SharedModule {
}
