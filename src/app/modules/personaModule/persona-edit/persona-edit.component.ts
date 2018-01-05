import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PersonasService, Persona } from 'services/personas.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { LoadingSpinnerComponent } from 'app/modules/sharedModule/loading-spinner/loading-spinner.component';
import { PersonaFormComponent } from 'app/modules/personaModule/persona-form/persona-form.component';
import { ToastsManager } from 'ng2-toastr';
import { SweetAlertService } from 'ng2-sweetalert2';
import { TagInputComponent } from 'ngx-chips';

@Component({
    moduleId: module.id,
    selector: 'persona-edit',
    templateUrl: 'persona-edit.component.html',
    styleUrls: ['persona-edit.component.scss']
})
export class PersonaEditComponent implements OnInit {

    isLoading: boolean = false;
    isUpdating: boolean = false;
    recordNotFound: boolean = false;
    showForm: boolean = false;
    persona: Persona = new Persona();

    constructor(private personaServices: PersonasService, private router: Router, private route: ActivatedRoute, private mixpanel: MixpanelService, private toast: ToastsManager, private alertSvc: SweetAlertService) { }

    ngOnInit(): void {
        // Load the persona
        this.isLoading = true;
        // Get the ID of the current route
        this.route.params.subscribe(
            params => {
                let id = params['id'];
                console.log("Loading persona", id);

                // Load persona
                this.personaServices.getSingle(id).subscribe(
                    response => {
                        console.log("Loaded persona", response);
                        this.isLoading = false;
                        this.showForm = true;
                        this.persona = response;
                    },
                    error => {
                        console.log("Error loading persona", id);
                        this.isLoading = false;
                        this.recordNotFound = true;
                    },
                    () => { }
                ); // /PersonaService
            }
        ); // /Params
    }

    cancel() {
        console.log('Cancel');
        this.router.navigateByUrl("/personas");
    }

    update() {
        console.log('Update')

        this.isUpdating = true;
        this.personaServices.update(this.persona).subscribe(
            response => {
                this.isUpdating = false;
                this.mixpanel.Track(MixpanelEvent.Update_persona, this.persona.id);
                this.toast.info("The persona has been updated", "Update persona");
                this.router.navigateByUrl("/personas");
            },
            error => {
                console.log("Error while trying to delete persona", error);
                this.mixpanel.TrackError("Error while trying to update persona", error);
                this.toast.error("Unable to update persona");
            }
        );
    }

    delete() {
        console.log('Delete');

        // Confirm the user wants to delete this comment
        this.alertSvc.swal({
            title: 'Are you sure?',
            text: "Are you sure you want to remove this persona?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(() => {
            // The user wants to delete this comment
            console.log("Confirmed delete");
            this.personaServices.delete(this.persona.id).subscribe(
                response => {
                    this.toast.info("Persona has been deleted", "Delete persona");
                    this.mixpanel.Track(MixpanelEvent.Remove_persona, this.persona.id);
                    this.router.navigateByUrl("/personas");
                },
                error => {
                    console.log("Error while trying to delete persona", error);
                    this.mixpanel.TrackError("Error while trying to delete persona", error);
                    this.toast.error("Unable to delete persona");
                }
            );
        });


    }
}
