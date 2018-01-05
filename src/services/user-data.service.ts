import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// This service is used to share information for the user around the whole application
@Injectable()
export class UserDataService {
  // Should the app be showing creator options
  showCreatorOptionsSubject = new BehaviorSubject(true);

  // Should the app be showing organisation options
  showOrganisationOptionsSubject = new BehaviorSubject(true);

  constructor() { }

}
