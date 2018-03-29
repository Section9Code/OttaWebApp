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
import { ContentItemTypeModel, ContentItemTypeService } from 'services/content-item-type.service';
import { ProjectIntegrationModel, ContentProjectIntegrationService } from 'services/ContentProjectIntegration.service';

// This service is shared by the content project pages to make sure important data is only processed once
@Injectable()
export class ContentProjectShareService {

  // Holds the current project
  currentProject = new BehaviorSubject<ContentProjectModel>(new ContentProjectModel());

  // Is the current user an admin of the project
  userIsAdmin = new BehaviorSubject<boolean>(false);

  // Drafts
  isLoadingContentItems = new BehaviorSubject<boolean>(false);
  contentItems = new BehaviorSubject<ContentItemModel[]>([]);

  // Content types
  isLoadingContentTypes = new BehaviorSubject<boolean>(false);
  contentTypes = new BehaviorSubject<ContentItemTypeModel[]>([]);

  // Integrations
  isLoadingIntegrations = new BehaviorSubject<boolean>(false);
  integrations = new BehaviorSubject<ProjectIntegrationModel[]>([]);


  // Construct the service
  constructor(
    private contentProjectService: ContentProjectService,
    private organisationService: OrganisationService,
    private userDataService: UserDataService,
    private contentItemService: ContentItemService,
    private toast: ToastsManager,
    private tracking: MixpanelService,
    private contentTypeService: ContentItemTypeService,
    private integrationService: ContentProjectIntegrationService) {
    console.log('ContentProjectShareService: Initialize');
  }


  // Load all the data the user needs to run the application. Called once the user has logged into the application
  loadProject(projectId: string) {
    console.log('ContentProjectShareService: Load project', projectId);

    // Reset data
    this.currentProject.next(new ContentProjectModel());
    this.contentItems.next([]);
    this.contentTypes.next([]);
    this.integrations.next([]);

    // Is the user an organisation admin
    this.userIsAdmin.next(this.userDataService.userIsOrgAdmin);

    // Load the project information from the service
    this.contentProjectService.getProject(projectId).subscribe(
      response => this.currentProject.next(response),
      error => console.log('ContentProjectShareService: Error loading project', projectId),
      () => console.log('ContentProjectShareService: Done loading project', projectId)
    );

    // Load content types
    this.contentTypeService.getTypes(projectId).subscribe(
      response => this.contentTypes.next(response),
      error => console.log('ContentProjectShareService: Error loading content types', projectId),
      () => console.log('ContentProjectShareService: Done loading content types', projectId)
    );

    // Load the project integrations
    this.isLoadingIntegrations.next(true);
    this.integrationService.getAll(projectId).subscribe(
      response => {
        this.integrations.next(response);
        this.isLoadingIntegrations.next(false);
      },
      error => {
        console.log('ContentProjectShareService: Error loading project integrations', projectId);
        this.isLoadingIntegrations.next(false);
      },
      () => console.log('ContentProjectShareService: Done loading integrations', projectId)
    );
  }


  // Lazy load the drafts for the current project
  lazyLoadContentItems() {
    // Have the drafts already been loaded
    console.log('ContentProjectShareService: Lazy load drafts');
    if (this.contentItems.getValue().length === 0) {
      // Load the drafts
      console.log('ContentProjectShareService: Loading drafts');
      this.isLoadingContentItems.next(true);
      this.contentItemService.getAll(this.currentProject.getValue().id).subscribe(
        response => {
          console.log('ContentProjectShareService: Drafts loaded', response);
          this.contentItems.next(response);
        },
        error => {
          this.toast.error('Error occurred trying to load drafts');
          this.tracking.TrackError('Error loading drafts', error);
        },
        () => this.isLoadingContentItems.next(false)
      );
    }
  }


  // Add a new draft to the list
  addContent(newDraft: ContentItemModel) {
    // Get the current list of drafts
    var draftList: ContentItemModel[] = this.contentItems.getValue();
    draftList.push(newDraft);
    this.contentItems.next(draftList);
  }

  // Update an existing draft in the list
  updateContent(updatedDraft: ContentItemModel) {
    // Get the current drafts
    var draftList: ContentItemModel[] = this.contentItems.getValue();

    // Find the matching draft
    var existingDraftIndex: number = draftList.findIndex(x => x.id === updatedDraft.id);

    // Update the draft
    if (existingDraftIndex > -1) {
      draftList[existingDraftIndex] = updatedDraft;
      this.contentItems.next(draftList);
    }
  }

  deleteContent(draftId: string) {
    // Get the current drafts
    var draftList: ContentItemModel[] = this.contentItems.getValue();

    // Find the matching draft
    var existingDraftIndex: number = draftList.findIndex(x => x.id === draftId);

    // Remove the draft
    if (existingDraftIndex > -1) {
      draftList.splice(existingDraftIndex, 1);
      this.contentItems.next(draftList);
    }
  }


  // Add a new content type to the list
  addContentType(type: ContentItemTypeModel) {
    var list = this.contentTypes.getValue();
    list.push(type);
    this.contentTypes.next(list);
  }

  // Remove an existing content type from the list
  removeContentType(type: ContentItemTypeModel) {
    var list = this.contentTypes.getValue();
    var index: number = list.findIndex(x => x.id === type.id);
    if (index > -1) {
      list.splice(index, 1);
      this.contentTypes.next(list);
    }
  }

  // Update an existing content type on the list
  updateContentType(type: ContentItemTypeModel) {
    var list = this.contentTypes.getValue();
    var index: number = list.findIndex(x => x.id === type.id);
    if (index > -1) {
      list[index] = type;
      this.contentTypes.next(list);
    }
  }

  updateProject(project: ContentProjectModel) {
    this.currentProject.next(project);
  }

}
