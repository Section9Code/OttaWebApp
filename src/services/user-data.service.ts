import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { UserService } from 'services/user.service';
import { ContentProjectService, ContentProjectModel } from 'services/content-project.service';
import { AuthService } from 'services/auth.service';
import { OrganisationService, Organisation } from 'services/organisation.service';

// This service is used to share information for the user around the whole application
@Injectable()
export class UserDataService {
  // Should the app be showing creator options
  showCreatorOptionsSubject = new BehaviorSubject(true);

  // Should the app be showing organisation options
  showOrganisationOptionsSubject = new BehaviorSubject(true);

  // The list of the users content projects
  usersContentProjectsSubject = new BehaviorSubject<ContentProjectModel[]>([]);

  // The users parent organisation
  usersOrganisationSubject = new BehaviorSubject<Organisation>(new Organisation());

  //userIsOrgAdmin: boolean = false;
  userIsOrgAdmin = new BehaviorSubject<boolean>(false);

  // Construct the service
  constructor(private userService: UserService, private contentProjectService: ContentProjectService,
    private organisationService: OrganisationService) {
    console.log('UserDataService: Initialize');
    this.loadUsersData();
  }

  // Load all the data the user needs to run the application. Called once the user has logged into the application
  loadUsersData() {
    // Load the users profile
    this.userService.getSettings().subscribe(
      response => {
        this.showCreatorOptionsSubject.next(response.ShowCreatorOptions);
        this.showOrganisationOptionsSubject.next(response.ShowOrganisationOptions);
      },
      error => console.log('UserDataService: User not logged in, using option defaults'),
      () => console.log('UserDataService: User profile data loaded')
    );

    // Load the users content projects
    this.contentProjectService.getProjects().subscribe(
      response => this.usersContentProjectsSubject.next(response),
      error => console.log('UserDataService: User not logged in, using project defaults'),
      () => console.log('UserDataService: Users projects loaded')
    );

    // Load the users organisation
    this.organisationService.get().subscribe(
      response => this.usersOrganisationSubject.next(response),
      error => console.log('UserDataService: Could not load the users organisation'),
      () => console.log('UserDataService: Users organisation loaded')
    );

    this.organisationService.isOrganisationAdmin().subscribe(
      response => this.userIsOrgAdmin.next(response),
      error => console.log('UserDataService: Could not load the users organisation admin status'),
      () => console.log('UserDataService: Users organisation admin status loaded', this.userIsOrgAdmin.getValue())
    );
  }

  // Add a project to the users project list
  addProject(project: ContentProjectModel) {
    const projectList = this.usersContentProjectsSubject.getValue();
    projectList.push(project);
    this.usersContentProjectsSubject.next(projectList);
  }

  removeProject(projectId: string) {
    const projects = this.usersContentProjectsSubject.getValue();
    const remainingProjects = projects.filter(function (el) { return el.id !== projectId; });
    this.usersContentProjectsSubject.next(remainingProjects);
  }

}
