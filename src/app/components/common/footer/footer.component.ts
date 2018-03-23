import { Component } from '@angular/core';
import { environment } from 'environments/environment';

declare var $: any;

@Component({
  selector: 'footer',
  templateUrl: 'footer.template.html'
})
export class FooterComponent {
  version: string = environment.version;
  suggestionText: string;

  showMakeSuggestion() {
    $(`#makeSuggestionModal`).modal('show');
  }

  makeSuggestion(message: string) { 
    console.log('Suggestion', message);
    $(`#makeSuggestionModal`).modal('hide');
  }
}

