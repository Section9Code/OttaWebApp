import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from 'app/modules/sharedModule/loading-spinner/loading-spinner.component';
import { StripeButtonComponent } from 'app/modules/sharedModule/stripe/stripe-button/stripe-button.component';
import { LaddaModule } from 'angular2-ladda';
import { PanelLoadingSpinnerComponent } from 'app/modules/sharedModule/panel-loading-spinner/panel-loading-spinner.component';
import { OttaPanelComponent } from 'app/modules/sharedModule/otta-panel/otta-panel.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { OttaCommentComponent } from 'app/modules/sharedModule/otta-comment/otta-comment.component';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from 'app/components/common/pipes/timeAgo.pipe';
import { PipesModule } from 'app/components/common/pipes/pipes.module';

// User Profile Feature Module 
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        LaddaModule,
        FormsModule,
        PipesModule       
    ],
    exports: [
        LoadingSpinnerComponent,
        StripeButtonComponent,
        PanelLoadingSpinnerComponent,
        OttaPanelComponent,
        OttaCommentComponent
    ],
    declarations: [
        LoadingSpinnerComponent,
        StripeButtonComponent,
        PanelLoadingSpinnerComponent,
        OttaPanelComponent,
        OttaCommentComponent
    ],
    providers: [
    ],
})
export class SharedModule {
}
