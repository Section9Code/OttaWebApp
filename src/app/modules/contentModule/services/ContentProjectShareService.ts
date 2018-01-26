import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { UserService } from 'services/user.service';
import { ContentProjectService, ContentProjectModel } from 'services/content-project.service';
import { AuthService } from 'services/auth.service';
import { OrganisationService, Organisation } from 'services/organisation.service';
import { ContentProjectListComponent } from 'app/modules/contentModule/components/content-project-list/content-project-list.component';
import { UserDataService } from 'services/user-data.service';

// This service is shared by the content project pages to make sure important data is only processed once
@Injectable()
export class ContentProjectShareService {

  // Holds the current project
  currentProject = new BehaviorSubject<ContentProjectModel>(new ContentProjectModel());
  // Is the current user an admin of the project
  userIsAdmin = new BehaviorSubject<boolean>(false);



  // Construct the service
  constructor(private contentProjectService: ContentProjectService, private organisationService: OrganisationService, 
    private userDataService: UserDataService) {
    console.log('ContentProjectShareService: Initialize');
  }

  // Load all the data the user needs to run the application. Called once the user has logged into the application
  loadProject(projectId: string) {
    console.log('ContentProjectShareService: Load project', projectId);

    // Is the user an organisation admin
    this.userIsAdmin.next(this.userDataService.userIsOrgAdmin);

    // Load the project information from the service
    this.contentProjectService.getProject(projectId).subscribe(
      response => this.currentProject.next(response),
      error => console.log('ContentProjectShareService: Error loading project', projectId),
      () => console.log('ContentProjectShareService: Done loading project', projectId)
    );

    
  }


}
