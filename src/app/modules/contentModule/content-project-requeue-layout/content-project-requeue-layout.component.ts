import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { RequeueReducedModel, RequeueService, RequeueModel } from 'services/requeue.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MixpanelService } from 'services/mixpanel.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { OrganisationService } from 'services/organisation.service';
import { environment } from 'environments/environment';

declare var $: any;

@Component({
  selector: 'app-content-project-requeue-layout',
  templateUrl: './content-project-requeue-layout.component.html',
  styleUrls: ['./content-project-requeue-layout.component.css']
})
export class ContentProjectRequeueLayoutComponent implements OnInit, OnDestroy {
  fullRequeues: RequeueModel[] = [];
  queues: RequeueReducedModel[] = [];

  // Flags
  isCreating = false;
  isLoadingQueues = false;

  createForm: FormGroup;

  subSharedQueues: Subscription;
  subFullRequeues: Subscription;

  constructor(
    private sharedService: ContentProjectShareService,
    private requeueService: RequeueService,
    private orgService: OrganisationService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private alertSvc: SweetAlertService,
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
    this.subSharedQueues = this.sharedService.requeues.subscribe(response => {
      console.log('Updated queues', response);
      this.queues = response;
    });

    this.isLoadingQueues = true;
    this.subFullRequeues = this.requeueService.getAllFull(this.sharedService.currentProject.getValue().id).subscribe(next => {
      this.fullRequeues = next;
      this.isLoadingQueues = false;
    },
      error => {
        // Error loading queues
        this.isLoadingQueues = false;
      });
  }

  ngOnDestroy() {
    if (this.subSharedQueues) { this.subSharedQueues.unsubscribe(); }
  }

  navigateToItem(item: RequeueReducedModel) {
    this.router.navigate([item.Id], { relativeTo: this.activatedRoute });
  }

  async showCreateModal() {
    // Make sure the current users organisation allows new queues to be added
    let org;
    try {
      org = await this.orgService.get().toPromise();
    }
    catch (e) {
      console.log(e);
      this.alertSvc.error('Unable to load you organisation details, please try again later');
      this.tracking.TrackError('Unable to load organisation details for user', e);
      return;
    }

    if (this.queues.length >= (org.CurrentPlan.MaxRequeues || environment.default_MaxRequeues)) {
      // The organisation cannot add new queues
      this.alertSvc.swal({
        title: 'Cannot create new requeue',
        text: 'You have reached the maximum number of requeues your subscription allows. Would you like to update your subscription to allow more requeues?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, view my subscription'
      }).then(() => {
        // Confirmed
        console.log('Confirmed');
        this.router.navigateByUrl('/organisation');
      }, error => { });
    } else {

      // Show the form
      this.createForm.reset();
      $(`#requeueModal`).modal('show');
    }
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
