import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionsViewComponent } from './suggestionsview/suggestionsview.component';
import { SuggestionViewComponent } from './suggestion-view/suggestion-view.component';
import { SuggestionCreateViewComponent } from './suggestion-create-view/suggestion-create-view.component';
import { LayoutsModule } from 'app/components/common/layouts/layouts.module';
import { RouterModule, Routes } from '@angular/router';
import { BasicLayoutComponent } from 'app/components/common/layouts/basicLayout.component';
import { AuthenticatedGuard } from 'services/security/auth-guard.service';
import { SharedModule } from '../sharedModule/shared.module';
import { PipesModule } from 'app/components/common/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

// Routes for this module to be added to the application
const suggestionRoutes: Routes = [
  {
    path: '', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
    children: [
      { path: '', component: SuggestionsViewComponent, canActivate: [AuthenticatedGuard] },
      { path: 'create', component: SuggestionCreateViewComponent, canActivate: [AuthenticatedGuard] },
      { path: 'suggestion/:id', component: SuggestionViewComponent, canActivate: [AuthenticatedGuard] }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    LayoutsModule,
    SharedModule,
    PipesModule,
    FormsModule,
    LaddaModule,
    RouterModule.forChild(suggestionRoutes),
  ],
  declarations: [
    SuggestionsViewComponent,
    SuggestionViewComponent,
    SuggestionCreateViewComponent
  ]
})
export class SuggestionModule { }
