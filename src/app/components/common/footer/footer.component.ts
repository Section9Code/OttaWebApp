import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { ToastsManager } from 'ng2-toastr';
import { UserService } from 'services/user.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';

declare var $: any;

@Component({
  selector: 'footer',
  templateUrl: 'footer.template.html'
})
export class FooterComponent {
  version: string = environment.version;
  suggestionText: string;

  constructor(private toast: ToastsManager, private userService: UserService, private tracking: MixpanelService) { }

  showMakeSuggestion() {
    $(`#makeSuggestionModal`).modal('show');
  }

  makeSuggestion(message: string) {
    console.log('Suggestion', message);

    // Store the suggestion
    this.userService.addSuggestion(message).toPromise()
      .then(response => {
        this.toast.success('Thank you for your suggestion');
        this.tracking.Track(MixpanelEvent.Added_Suggestion);
      })
      .catch(error => {
        this.toast.error('Sorry, can\'t take your suggestion right now');
        this.tracking.TrackError('Error occurred when the user tried to add a suggestion', error);
      });

    // Close the modal
    $(`#makeSuggestionModal`).modal('hide');
  }
}

