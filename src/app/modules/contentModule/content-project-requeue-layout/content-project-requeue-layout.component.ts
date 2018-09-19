import { Component, OnInit } from '@angular/core';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { RequeueReducedModel, RequeueService, RequeueModel } from 'services/requeue.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MixpanelService } from 'services/mixpanel.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-content-project-requeue-layout',
  templateUrl: './content-project-requeue-layout.component.html',
  styleUrls: ['./content-project-requeue-layout.component.css']
})
export class ContentProjectRequeueLayoutComponent implements OnInit {
  private queues: RequeueReducedModel[] = [];
  private isCreating = false;

  private createForm: FormGroup;

  constructor(
    private sharedService: ContentProjectShareService,
    private requeueService: RequeueService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // Setup the create form
    this.createForm = new FormGroup({
      queueName: new FormControl('', Validators.required),
      queueColour: new FormControl('', Validators.required)
    });

  }

  ngOnInit() {
    // Get the requeues from the system
    this.sharedService.requeues.subscribe(response => {
      console.log('Updated queues', response);
      this.queues = response;
    });
  }

  navigateToItem(item: RequeueReducedModel) {
    this.router.navigate(['/', item.Id], { relativeTo: this.activatedRoute });
  }

  showCreateModal() {
    this.createForm.reset();
    $(`#requeueModal`).modal('show');
  }

  createQueue() {
    console.log('Create queue', this.createForm);

    if (this.createForm.valid) {

      const newQueue = new RequeueModel();
      newQueue.Name = this.createForm.controls.queueName.value;
      newQueue.ColourHex = this.createForm.controls.queueColour.value;

      // Create the queue
      this.isCreating = true;
      this.requeueService.create(this.sharedService.currentProject.getValue().id, newQueue).toPromise()
        .then(response => {
          this.isCreating = false;
          $(`#requeueModal`).modal('hide');
          console.log('Requeue created');
          this.toast.success(`Requeue <b>${response.Name}</b> created`)

          // Update the shared service with the new queue
          const queueDetails: RequeueReducedModel = {
            Id: response.id,
            Name: response.Name,
            ProjectId: response.ProjectId,
            ColourHex: response.ColourHex,
            Messages: 0,
            TimeSlots: 0
          };
          this.sharedService.addRequeue(queueDetails);
        })
        .catch(error => {
          this.isCreating = false;
          $(`#requeueModal`).modal('hide');

          console.log('Error creating requeue', error);
          this.tracking.TrackError('Error while trying to create requeue', error);
          this.toast.error('Error while trying to create requeue, please try again later');
        });
    }
  }

  cancelCreateQueue() {
    $(`#requeueModal`).modal('hide');
  }

}
