import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IContentItemMessageForm } from '../IContentItemMessageForm';
import { ContentItemMessageModel, ContentItemModel } from 'services/content-item.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ProjectIntegrationModel, FacebookProjectIntegrationModel, IntegrationTypes, ContentProjectIntegrationService } from 'services/ContentProjectIntegration.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-content-item-message-facebook-form',
  templateUrl: './content-item-message-facebook-form.component.html',
  styleUrls: ['./content-item-message-facebook-form.component.css']
})
export class ContentItemMessageFacebookFormComponent implements OnInit, IContentItemMessageForm {
  // Component inputs/outputs
  @Input() contentItem: ContentItemModel = new ContentItemModel();
  @Input() images: string[] = [];
  @Output() messageAdded = new EventEmitter();

  // The form the user fills in on the page
  facebookForm = new FormGroup({
    message: new FormControl('', Validators.required),
    linkUrl: new FormControl(''),
    facebookPage: new FormControl('', Validators.required),
    sendType: new FormControl(''),
    sendDateTime: new FormControl(''),
    relativeUnit: new FormControl(''),
    relativeAmount: new FormControl('')
  }, this.validateForm);

  facebookIntegration = new FacebookProjectIntegrationModel();

  constructor(private sharedService: ContentProjectShareService, private integrationService: ContentProjectIntegrationService) {
    console.log('Form', this.facebookForm);
  }

  // Validates the form to make sure it is valid
  validateForm(group: FormGroup) {
    console.log('Validate form', group);

    // // Clear errors
    group.controls.sendDateTime.setErrors(null);
    group.controls.relativeUnit.setErrors(null);
    group.controls.relativeAmount.setErrors(null);

    if (group.controls.sendType.value === 'specific') {
      // Specific send time
      if (!group.controls.sendDateTime.value) {
        group.controls.sendDateTime.setErrors({ isRequired: true });
      }
    } else {
      // Relative send time
      if (!group.controls.relativeUnit.value) {
        group.controls.relativeUnit.setErrors({ isRequired: true });
      }

      if (!group.controls.relativeAmount.value) {
        group.controls.relativeAmount.setErrors({ isRequired: true });
      }
    }

    return null;
  }

  ngOnInit(): void {
    // Load the users facebook integrations
    this.integrationService.facebookGetAllIntegrations(this.contentItem.ProjectId).toPromise()
      .then(response => {
        console.log('Integrations', response);
        if (response && response.length > 0) {
          // Save the details of the users facebook integration
          this.facebookIntegration = response[0];
        }
      })
      .catch(() => {
        console.log('Error loading project integrations');
      });
  }

  resetForm() {
    console.log('Facebook form: Reset');
    this.facebookForm.reset();
  }

  editMessage(message: ContentItemMessageModel) {
    console.log('Facebook form: Edit message', message);
  }
}
