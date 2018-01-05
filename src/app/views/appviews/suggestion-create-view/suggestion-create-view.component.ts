import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';

import { SuggestionsService, CreateSuggestion } from "services/suggestions.service";
import { MixpanelService, MixpanelEvent } from "services/mixpanel.service";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
    moduleId: module.id,
    selector: 'suggestion-create-view',
    templateUrl: 'suggestion-create-view.component.html',
    styleUrls: ['suggestion-create-view.component.scss']
})
export class SuggestionCreateViewComponent implements OnInit {
    currentUser: string;
    suggestion: CreateSuggestion;
    isCreating: boolean;

    constructor(private route: Router, private suggestionService: SuggestionsService, private mixpanel: MixpanelService, private toast: ToastsManager) { 
        this.isCreating = false;
        this.currentUser = localStorage.getItem("AuthId");
    }

    ngOnInit(): void {
        this.suggestion = new CreateSuggestion();
    }

    onSubmit() {
        console.log('Submit form');
        this.isCreating = true;
        this.suggestionService.create(this.suggestion).subscribe(
            response => {
                // Created the suggestion
                console.log('Created suggestion', response)
                this.toast.success('Suggestion created');
                this.mixpanel.Track(MixpanelEvent.Create_Suggestion, { Suggestion: response.id });
                this.route.navigateByUrl('/suggestions');
            },
            error => {
                console.log('Error while creating suggestion', error);
                this.mixpanel.TrackError("Error while trying to create suggestion, error");
                this.toast.error("Unable to create suggestion");
            },
            () => {
                this.isCreating = false;
            }
        );
    }

    cancel() {
        this.route.navigateByUrl('/suggestions');
    }

}
