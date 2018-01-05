import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { CommonModule } from '@angular/common';
import { AgendaComponent } from "app/components/widgets/Agenda/Agenda.component";
import { IboxtoolsModule } from "app/components/common/iboxtools/iboxtools.module";
import { PeityModule } from "app/components/charts/peity";

@NgModule({
    declarations: [
        AgendaComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        IboxtoolsModule,
        PeityModule
    ],
    exports: [
        AgendaComponent
    ],
})
export class WidgetsModule {
}