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
import { ContentItemModel, ContentItemService } from 'services/content-item.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { MixpanelService } from 'services/mixpanel.service';

// This service is shared by the content project pages to make sure important data is only processed once
@Injectable()
export class ContentProjectShareService {

  // Holds the current project
  currentProject = new BehaviorSubject<ContentProjectModel>(new ContentProjectModel());

  // Is the current user an admin of the project
  userIsAdmin = new BehaviorSubject<boolean>(false);

  // Drafts
  isLoadingDrafts = new BehaviorSubject<boolean>(false);
  drafts = new BehaviorSubject<ContentItemModel[]>([]);


  // Construct the service
  constructor(private contentProjectService: ContentProjectService, private organisationService: OrganisationService,
    private userDataService: UserDataService, private contentItemService: ContentItemService, private toast: ToastsManager,
    private tracking: MixpanelService) {
    console.log('ContentProjectShareService: Initialize');
  }


  // Load all the data the user needs to run the application. Called once the user has logged into the application
  loadProject(projectId: string) {
    console.log('ContentProjectShareService: Load project', projectId);

    // Reset data
    this.currentProject.next(new ContentProjectModel());
    this.drafts.next([]);

    // Is the user an organisation admin
    this.userIsAdmin.next(this.userDataService.userIsOrgAdmin);

    // Load the project information from the service
    this.contentProjectService.getProject(projectId).subscribe(
      response => this.currentProject.next(response),
      error => console.log('ContentProjectShareService: Error loading project', projectId),
      () => console.log('ContentProjectShareService: Done loading project', projectId)
    );
  }


  // Lazy load the drafts for the current project
  lazyLoadDrafts() {
    // Have the drafts already been loaded
    console.log('ContentProjectShareService: Lazy load drafts');
    if (this.drafts.getValue().length === 0) {
      // Load the drafts
      console.log('ContentProjectShareService: Loading drafts');
      this.isLoadingDrafts.next(true);
      this.contentItemService.getDrafts(this.currentProject.getValue().id).subscribe(
        response => {
          console.log('ContentProjectShareService: Drafts loaded', response);
          this.drafts.next(response);
        },
        error => {
          this.toast.error('Error occurred trying to load drafts');
          this.tracking.TrackError('Error loading drafts', error);
        },
        () => this.isLoadingDrafts.next(false)
      );
    }
  }


  // Add a new draft to the list
  addDraft(newDraft: ContentItemModel) {
    // Get the current list of drafts
    var draftList: ContentItemModel[] = this.drafts.getValue();
    draftList.push(newDraft);
    this.drafts.next(draftList);
  }


}
