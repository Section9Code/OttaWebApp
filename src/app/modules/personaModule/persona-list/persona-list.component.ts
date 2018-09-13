import { Component, OnInit, OnDestroy } from '@angular/core';
import { Persona, PersonasService } from 'services/personas.service';
import { MixpanelService } from 'services/mixpanel.service';
import { LoadingSpinnerComponent } from 'app/modules/sharedModule/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'persona-list.component',
    templateUrl: 'persona-list.component.html',
    styleUrls: ['persona-list.component.scss']
})
export class PersonaListComponent implements OnInit {
    isLoading = false;
    personas: Persona[];

    constructor(
        private personaService: PersonasService,
        private mixpanel: MixpanelService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Load personas
        this.isLoading = true;
        this.personaService.getAll().subscribe(
            response => {
                console.log("Personas loaded", response);
                this.personas = response;
            },
            error => {
                console.log("Error occurred while while loading personas", error);
                this.mixpanel.TrackError("Error occurred while loading personas", error);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

}
