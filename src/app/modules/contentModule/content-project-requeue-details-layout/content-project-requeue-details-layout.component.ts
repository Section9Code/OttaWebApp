import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { RequeueService, RequeueModel } from 'services/requeue.service';
import { ContentProjectShareService } from '../services/ContentProjectShareService';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-content-project-requeue-details-layout',
  templateUrl: './content-project-requeue-details-layout.component.html',
  styleUrls: ['./content-project-requeue-details-layout.component.css']
})
export class ContentProjectRequeueDetailsLayoutComponent implements OnInit, OnDestroy {
  currentQueue: RequeueModel = new RequeueModel();
  isLoading = false;

  subRoute: Subscription;

  constructor(
    private sharedService: ContentProjectShareService,
    private requeueService: RequeueService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Load the queue the user wants
    this.isLoading = true;
    var subRoute = this.activatedRoute.params.subscribe(params => {
      // Get the ID of the current param
      console.log('Loaded params', params);
      const queueId = params['queueId'];
      console.log('Loading queue ID', queueId);
      this.requeueService.getSingle(this.sharedService.currentProject.getValue().id, queueId).toPromise()
      .then(response => {
        // Queue loaded
        console.log('Loaded queue', response);
        this.currentQueue = response;
        this.isLoading = false;
      })
      .catch(error => {
        // Error loading queue
        console.log('Error loading queue');
        this.tracking.TrackError('Error loading requeue', error);
        this.toast.error('Unable to load requeue, please try again later');
      });
    });
  }

  ngOnDestroy() {
    if(this.subRoute) { this.subRoute.unsubscribe(); };
  }

}
