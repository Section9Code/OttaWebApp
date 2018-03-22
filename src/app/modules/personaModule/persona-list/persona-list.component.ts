import { Component, OnInit, OnDestroy } from '@angular/core';
import { Persona, PersonasService } from 'services/personas.service';
import { MixpanelService } from 'services/mixpanel.service';
import { LoadingSpinnerComponent } from 'app/modules/sharedModule/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';
import { TourService } from 'services/tour.service';


@Component({
    moduleId: module.id,
    selector: 'persona-list.component',
    templateUrl: 'persona-list.component.html',
    styleUrls: ['persona-list.component.scss']
})
export class PersonaListComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    personas: Persona[];

    constructor(
        private personaService: PersonasService,
        private mixpanel: MixpanelService,
        private router: Router,
        private tour: TourService
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

        this.setupTour();
    }

    ngOnDestroy(): void {
        this.tour.clear();
    }

    setupTour() {
        var steps = [
            {
                element: '#all',
                title: 'Personas',
                content: 'Personas keep you focused when you are creating content, they let you feel like you are talking to a real person. <br/><br/>Content created with personas is more personal and gets a better response',
                placement: 'top',
                orphan: true
            },
            {
                element: '#persona_list',
                title: 'Persona list',
                content: 'Here you can keep track of all your personas you have created.',
                placement: 'top'
            },
            {
                element: '#create_persona',
                title: 'Create a new persona',
                content: 'Create a new persona by clicking on the button',
                placement: 'right',
                backdrop: true,
                backdropContainer: '#wrapper'
            }
        ];

        this.tour.init(steps);
    }
}
