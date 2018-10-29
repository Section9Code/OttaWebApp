import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { LayoutsModule } from 'app/components/common/layouts/layouts.module';
import { BasicLayoutComponent } from 'app/components/common/layouts/basicLayout.component';
import { AuthenticatedGuard } from 'services/security/auth-guard.service';
import { LaddaModule } from 'angular2-ladda';

import { PersonaListComponent } from 'app/modules/personaModule/persona-list/persona-list.component';
import { PersonaCreateComponent } from 'app/modules/personaModule/persona-create/persona-create.component';
import { PersonasService } from 'services/personas.service';
import { ToastModule } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { SharedModule } from 'app/modules/sharedModule/shared.module';
import { TagInputModule } from 'ngx-chips';
import { PersonaFormComponent } from 'app/modules/personaModule/persona-form/persona-form.component';
import { PersonaEditComponent } from 'app/modules/personaModule/persona-edit/persona-edit.component';
import { ImagesService } from 'services/images.service';
import { CommonModule } from '@angular/common';

// Routes for this module to be added to the application
const routes: Routes = [
    {
        path: '', component: BasicLayoutComponent, canActivate: [AuthenticatedGuard],
        children: [
            { path: '', component: PersonaListComponent, canActivate: [AuthenticatedGuard] },
            { path: 'create', component: PersonaCreateComponent, canActivate: [AuthenticatedGuard] },
            { path: ':id', component: PersonaEditComponent, canActivate: [AuthenticatedGuard] }
        ]
    }
];

// User Profile Feature Module 
@NgModule({
    imports: [
        CommonModule,
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
        PersonaListComponent,
        PersonaCreateComponent
    ],
    declarations: [
        PersonaListComponent,
        PersonaCreateComponent,
        PersonaEditComponent,
        PersonaFormComponent
    ],
    providers: [
        PersonasService,
        ImagesService,
        MixpanelService
    ],
})
export class PersonaModule {
}
