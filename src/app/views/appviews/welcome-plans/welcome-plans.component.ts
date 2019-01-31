import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrganisationService, PlanInfo, PaymentInfo } from 'services/organisation.service';
import { environment } from 'environments/environment';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-welcome-plans',
  templateUrl: './welcome-plans.component.html',
  styleUrls: ['./welcome-plans.component.css']
})
export class WelcomePlansComponent implements OnInit {
  @Output() next = new EventEmitter<void>();

  option = '';
  plans = [];
  isUpdating = false;

  constructor(
    private orgService: OrganisationService,
    private tracking: MixpanelService,
    private toast: ToastsManager
  ) { }

  ngOnInit() {
    this.plans = environment.plans;
    this.option = localStorage.getItem('welcomeOption');
  }

   // The user has updated their subscription
   subscriptionPaid(token: string) {
    this.tracking.Track(MixpanelEvent.Update_subscription);
    this.isUpdating = true;

    const subscriptionUpdate = new PaymentInfo();
    subscriptionUpdate.numberOfUsers = 1;
    subscriptionUpdate.paymentToken = token;

    // Update subscription
    this.orgService.paySubscription(subscriptionUpdate).subscribe(
      response => {
        console.log('Subscription updated', response);
        this.toast.success('Your subscription has been successfully updated. Thank you', 'Subscription paid');
        this.next.emit();
      },
      error => {
        console.log('Error updating subscription', error);
        this.isUpdating = false;
        this.toast.error('Sorry. Unable to update your subscription');
        this.tracking.TrackError('Error occurred while updating subscription', error);
      }
    );
  }

  complete() {
    this.next.emit();
  }

}
