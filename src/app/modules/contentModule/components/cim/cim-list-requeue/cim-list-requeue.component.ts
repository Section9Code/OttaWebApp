import { Component, OnInit, OnChanges, Input, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { RequeueModel } from 'services/requeue.service';
import { ContentProjectShareService } from '../../../services/ContentProjectShareService';
import { IntegrationTypes, FacebookProjectIntegrationModel, PinterestProjectIntegrationModel, ContentProjectIntegrationService } from 'services/ContentProjectIntegration.service';
import { ICimEditorCommon } from '../cim-editor-common';
import { ContentItemMessageModel } from 'services/content-item.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { CimMessagesListComponent } from '../cim-messages-list/cim-messages-list.component';

// Allow talking to jQuery
declare var $: any;

@Component({
  selector: 'app-cim-list-requeue',
  templateUrl: './cim-list-requeue.component.html',
  styleUrls: ['./cim-list-requeue.component.css']
})
export class CimListRequeueComponent implements OnInit, OnChanges {
  // Interactions
  @Input() messages: ContentItemMessageModel[] = [];        // The array of messages to show
  @Input() images = [];                                     // The array of images for the messages
  _images = [];                                             // The managed list of images used for the editors

  @Output() onCreateMessage = new EventEmitter<ContentItemMessageModel>();
  @Output() onUpdateMessage = new EventEmitter<ContentItemMessageModel>();
  @Output() onRemoveMessage = new EventEmitter<string>();

  // Flags
  noIntegrations = true;
  canAddTwitterMessages: boolean;
  canAddFacebookMessages: boolean;
  canAddLinkedInMessages: boolean;
  canAddPinterestMessages: boolean;
  facebookIntegration: FacebookProjectIntegrationModel;
  pinterestIntegration: PinterestProjectIntegrationModel;

  // Editors
  @ViewChild('twitterEditor') private twitterEditor: ICimEditorCommon;
  @ViewChild('facebookEditor') private facebookEditor: ICimEditorCommon;
  @ViewChild('linkedinEditor') private linkedinEditor: ICimEditorCommon;
  @ViewChild('pinterestEditor') private pinterestEditor: ICimEditorCommon;

  @ViewChild('messageListComponent') private messageListComponent: CimMessagesListComponent;

  constructor(
    private sharedService: ContentProjectShareService,
    private projectIntegrationService: ContentProjectIntegrationService,
    private alertSvc: SweetAlertService
  ) { }

  ngOnInit() {
    console.log('Requeue List - Init');
    this.loadIntegrations();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Requeue List - Changed', changes);

    // Has the images been changed? If there is a new value
    if(changes.images && (changes.images.currentValue !== changes.images.previousValue)) {
      console.log('Requeue List - Changed - Images');
      if(changes.images.currentValue) {
        this.images = changes.images.currentValue;
        this._images = changes.images.currentValue;
      } else {
        // Null value passed in, empty the arrays but don't set to null>>
        this.images = [];
        this._images = [];
      }
    }
  }

  // Used to tell the control to redraw it's list.
  // HACK: Sometimes the change detection doesn't work correctly and the message list isn't passed
  // down to the child list to be shown. This forces the list to redraw correctly
  public redraw() {
    console.log('Requeue List - Updated');
    this.messageListComponent.redraw();
  }

  // Loads the integrations the project has and stops users from picking options they have not configured
  private loadIntegrations() {
    const integrations = this.sharedService.integrations.getValue();
    const twitterIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.Twitter);
    const facebookIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.Facebook);
    const linkedInIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.LinkedIn);
    const pinterestIntegrations = integrations.filter(e => e.IntegrationType === IntegrationTypes.Pinterest);

    // Set the flags for each type of integration the user has
    if (twitterIntegrations.length > 0) { this.canAddTwitterMessages = true; this.noIntegrations = false; }
    if (facebookIntegrations.length > 0) { this.canAddFacebookMessages = true; this.noIntegrations = false; }
    if (linkedInIntegrations.length > 0) { this.canAddLinkedInMessages = true; this.noIntegrations = false; }
    if (pinterestIntegrations.length > 0) { this.canAddPinterestMessages = true; this.noIntegrations = false; }

    // Get specific integrations
    this.projectIntegrationService.facebookGetAllIntegrations(this.sharedService.currentProject.getValue().id).toPromise().then(response => {
      this.facebookIntegration = response[0];
    });

    this.projectIntegrationService.pinterestGetAllIntegrations(this.sharedService.currentProject.getValue().id).toPromise().then(response => {
      this.pinterestIntegration = response[0];
    });
  }

  // Show a modal popup
  showModal(modalName: string) {
    if (!modalName || modalName === '') { return; }
    $(`#${modalName}`).modal('show');
  }

  // Hide a modal popup
  hideModal(modalName: string) {
    if (!modalName || modalName === '') { return; }
    $(`#${modalName}`).modal('hide');
  }

  // Handle when the user cancels an editor
  handleCancelled(modalName: string) {
    this.hideModal(modalName);
  }

  // The user wants to add a twitter message
  addTwitterMessage() {
    this.twitterEditor.reset();
    this.showModal('twitterModal');
  }

  addFacebookMessage() {
    this.facebookEditor.reset();
    this.showModal('facebookModal');
  }

  addLinkedinMessage() {
    this.linkedinEditor.reset();
    this.showModal('linkedinModal');
  }

  addPinterestMessage() {
    this.pinterestEditor.reset();
    this.showModal('pinterestModal');
  }

  editMessage(messageId: string) {
    console.log('Requeue List - Edit message', messageId);
    // Find the message
    const message = this.messages.find(m => m.Id === messageId);
    if (!message) { return; }

    // Pick the right editor to edit this message
    let modalName: string;
    let editor: ICimEditorCommon;
    switch (message.MessageType) {
      case IntegrationTypes.Twitter:
        editor = this.twitterEditor;
        modalName = 'twitterModal';
        break;

      case IntegrationTypes.Facebook:
        editor = this.facebookEditor;
        modalName = 'facebookModal';
        break;

      case IntegrationTypes.LinkedIn:
        editor = this.linkedinEditor;
        modalName = 'linkedinModal';
        break;

      case IntegrationTypes.Pinterest:
        editor = this.pinterestEditor;
        modalName = 'pinterestModal';
        break;
    }

    // Show the editor
    editor.edit(message);
    this.showModal(modalName);
  }


  // Handle when the user has created a message
  handleMessageCreated(message: ContentItemMessageModel, modalName: string) {
    this.hideModal(modalName);
    this.onCreateMessage.emit(message);
  }

  // Handle when the user has updated a message
  handleMessageUpdated(message: ContentItemMessageModel, modalName: string) {
    this.hideModal(modalName);
    this.onUpdateMessage.emit(message);
  }

  // Handle when the user wants to remove a message
  handleMessageRemoved(messageId: string, modalName: string) {
    this.hideModal(modalName);

    this.alertSvc.swal({
      title: 'Delete message',
      text: 'Are you sure you want to delete this message?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      this.onRemoveMessage.emit(messageId);
    },
      error => {
        // Error
        console.log('Alert dismissed');
      },
      () => {
        // Complete
      }
    );



  }
}


