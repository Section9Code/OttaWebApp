import { Component, OnInit } from '@angular/core';
import { Persona, PersonasService } from 'services/personas.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { TagInputComponent } from 'ngx-chips';
import { PersonaFormComponent } from 'app/modules/personaModule/persona-form/persona-form.component';

@Component({
    moduleId: module.id,
    selector: 'persona-create',
    templateUrl: 'persona-create.component.html',
    styleUrls: ['persona-create.component.scss']
})
export class PersonaCreateComponent implements OnInit {

    isCreating: boolean;
    formData: Persona = new Persona();

    constructor(private personaService: PersonasService, private route: Router, private mixpanel: MixpanelService, private toast: ToastsManager){}

    ngOnInit(): void {
    }

    cancel(){
        console.log('Cancel');
        this.route.navigateByUrl('/personas');
    }

    create(){
        console.log("Create persona", this.formData);
        this.isCreating = true;
        this.personaService.create(this.formData).subscribe(
            response => {
                console.log('Persona created');
                this.isCreating = false;
                this.mixpanel.Track(MixpanelEvent.Create_persona);            
                this.toast.success("Persona created");
                this.route.navigateByUrl("/personas");
            },
            error => {                
                console.log('Error', error);
                this.isCreating = false;
                this.mixpanel.TrackError("Error occurred while trying to add persona", error);
                this.toast.error("Error occurred while trying to create persona");
            }
        );
    }
}
