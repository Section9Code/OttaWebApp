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
import { ProjectIntegrationModel, ContentProjectIntegrationService, IntegrationTypes } from 'services/ContentProjectIntegration.service';
import { RequeueModel, RequeueService, RequeueReducedModel } from 'services/requeue.service';

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

  // Requeue
  isLoadingRequeues = new BehaviorSubject<boolean>(false);
  requeues = new BehaviorSubject<RequeueReducedModel[]>([]);


  // Construct the service
  constructor(
    private contentProjectService: ContentProjectService,
    private userDataService: UserDataService,
    private contentItemService: ContentItemService,
    private toast: ToastsManager,
    private tracking: MixpanelService,
    private contentTypeService: ContentItemTypeService,
    private integrationService: ContentProjectIntegrationService,
    private requeueService: RequeueService) {
    console.log('ContentProjectShareService: Initialize');
  }


  // Load all the data the user needs to see a project (called once and shared across all pages in the project)
  loadProject(projectId: string) {
    console.log('ContentProjectShareService: Load project', projectId);

    // Reset data
    this.currentProject.next(new ContentProjectModel());
    this.contentItems.next([]);
    this.contentTypes.next([]);
    this.integrations.next([]);
    this.requeues.next([]);

    // Is the user an organisation admin
    this.userIsAdmin.next(this.userDataService.userIsOrgAdmin);

    // Load the project information from the service
    this.contentProjectService.getProject(projectId).subscribe(
      response => this.currentProject.next(response),
      error => console.log('ContentProjectShareService: Error loading project'),
      () => console.log('ContentProjectShareService: Done loading project')
    );

    // Load content types
    this.contentTypeService.getTypes(projectId).subscribe(
      response => this.contentTypes.next(response),
      error => console.log('ContentProjectShareService: Error loading content types'),
      () => console.log('ContentProjectShareService: Done loading content types')
    );

    // Load the project integrations
    this.isLoadingIntegrations.next(true);
    this.integrationService.getAll(projectId).subscribe(
      response => {
        this.integrations.next(response);
        this.isLoadingIntegrations.next(false);
      },
      error => {
        console.log('ContentProjectShareService: Error loading project integrations');
        this.isLoadingIntegrations.next(false);
      },
      () => console.log('ContentProjectShareService: Done loading integrations')
    );


    // Load the project requeue
    this.isLoadingRequeues.next(true);
    this.requeueService.getAll(projectId).subscribe(
      response => {
        this.requeues.next(response);
        this.isLoadingRequeues.next(false);
      },
      error => {
        this.isLoadingRequeues.next(false);
        console.log('ContentProjectShareService: Error loading requeues');
      },
      () => console.log('ContentProjectShareService: Done loading requeues')
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
    const draftList: ContentItemModel[] = this.contentItems.getValue();
    draftList.push(newDraft);
    this.contentItems.next(draftList);
  }

  // Update an existing draft in the list
  updateContent(updatedDraft: ContentItemModel) {
    // Get the current drafts
    const draftList: ContentItemModel[] = this.contentItems.getValue();

    // Find the matching draft
    const existingDraftIndex: number = draftList.findIndex(x => x.id === updatedDraft.id);

    // Update the draft
    if (existingDraftIndex > -1) {
      draftList[existingDraftIndex] = updatedDraft;
      this.contentItems.next(draftList);
    }
  }

  deleteContent(draftId: string) {
    // Get the current drafts
    const draftList: ContentItemModel[] = this.contentItems.getValue();

    // Find the matching draft
    const existingDraftIndex: number = draftList.findIndex(x => x.id === draftId);

    // Remove the draft
    if (existingDraftIndex > -1) {
      draftList.splice(existingDraftIndex, 1);
      this.contentItems.next(draftList);
    }
  }


  // Add a new content type to the list
  addContentType(type: ContentItemTypeModel) {
    const list = this.contentTypes.getValue();
    list.push(type);
    this.contentTypes.next(list);
  }

  // Remove an existing content type from the list
  removeContentType(type: ContentItemTypeModel) {
    const list = this.contentTypes.getValue();
    const index: number = list.findIndex(x => x.id === type.id);
    if (index > -1) {
      list.splice(index, 1);
      this.contentTypes.next(list);
    }
  }

  // Update an existing content type on the list
  updateContentType(type: ContentItemTypeModel) {
    const list = this.contentTypes.getValue();
    const index: number = list.findIndex(x => x.id === type.id);
    if (index > -1) {
      list[index] = type;
      this.contentTypes.next(list);
    }
  }

  updateProject(project: ContentProjectModel) {
    this.currentProject.next(project);
  }

  addIntegration(newIntegration: ProjectIntegrationModel) {
    const list = this.integrations.getValue();
    list.push(newIntegration);
    this.integrations.next(list);
  }

  updateIntegration(integration: ProjectIntegrationModel) {
    this.removeIntegration(integration.id);
    this.addIntegration(integration);
  }

  removeIntegration(oldIntegrationId: string) {
    const list = this.integrations.getValue();
    const index: number = list.findIndex(x => x.id === oldIntegrationId);
    if (index > -1) {
      list.splice(index, 1);
      this.integrations.next(list);
    }
  }

  hasWordpressIntegration(): boolean {
    const list = this.integrations.getValue();
    const index = list.findIndex(i => i.IntegrationType === IntegrationTypes.Wordpress);
    return index !== -1;
  }

  hasMediumIntegration(): boolean {
    const list = this.integrations.getValue();
    const index = list.findIndex(i => i.IntegrationType === IntegrationTypes.Medium);
    return index !== -1;
  }

  addRequeue(queue: RequeueReducedModel) {
    const list = this.requeues.getValue();
    list.push(queue);
    this.requeues.next(list);
  }

  removeRequeue(id: string) {
    const list = this.requeues.getValue();
    const index = list.findIndex(x => x.Id === id);
    if (index > -1) {
      list.splice(index, 1);
      this.requeues.next(list);
    }
  }

  updateRequeue(queue: RequeueReducedModel) {
    this.removeRequeue(queue.Id);
    this.addRequeue(queue);
  }

}
