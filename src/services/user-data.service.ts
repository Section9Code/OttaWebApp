import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { UserService } from 'services/user.service';
import { ContentProjectService, ContentProjectModel } from 'services/content-project.service';

// This service is used to share information for the user around the whole application
@Injectable()
export class UserDataService {

  // Should the app be showing creator options
  showCreatorOptionsSubject = new BehaviorSubject(true);

  // Should the app be showing organisation options
  showOrganisationOptionsSubject = new BehaviorSubject(true);

  // The list of the users content projects
  usersContentProjectsSubject = new BehaviorSubject<ContentProjectModel[]>([]);

  constructor(private userService: UserService, private contentProjectService: ContentProjectService) { }

  // Load all the data the user needs to run the application. Called once the user has logged into the application
  loadUsersData() {
    // Load the users profile
    this.userService.getSettings().subscribe(
      response => {
        this.showCreatorOptionsSubject.next(response.ShowCreatorOptions);
        this.showOrganisationOptionsSubject.next(response.ShowOrganisationOptions);
      },
      error => console.log('UserDataService: Error loading user details', error),
      () => console.log('UserDataService: User profile data loaded')
    );

    // Load the users content projects
    this.contentProjectService.getProjects().subscribe(
      response => this.usersContentProjectsSubject.next(response),
      error => console.log('UserDataService: Error loading the users projects', error),
      () => console.log('UserDataService: Users projects loaded')
    );
  }

  // Add a project to the users project list
  addProject(project: ContentProjectModel)
  {
    let projectList = this.usersContentProjectsSubject.getValue();
    projectList.push(project);
    this.usersContentProjectsSubject.next(projectList);
  }

}
