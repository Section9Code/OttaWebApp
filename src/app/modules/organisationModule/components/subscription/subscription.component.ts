import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { OrganisationService, Organisation, OrganisationUsers, OrganisationPaymentPlan, PricingPlan, PaymentInfo } from 'services/organisation.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { environment } from 'environments/environment';
import { ContentProjectService } from 'services/content-project.service';
import { RequeueService } from 'services/requeue.service';
import { AnalyticsService } from 'services/analytics.service';

declare var $: any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  organisation: Organisation;
  organisationUsers: OrganisationUsers;
  isLoading = false;
  planDetails: PricingPlan;

  userAllowance = 0;                  // Number of users on current plan
  discountAmountPerMonth = 0;         // Discount the user gets per month
  amountToCharge = 0;
  offerTerms = '';
  discountTerms = '';

  defaultMaxProjects = 1;
  defaultMaxRequeues = 1;

  @Output() organisationUpdate = new EventEmitter<Organisation>();

  constructor(
    private orgService: OrganisationService,
    private toast: ToastsManager,
    private alertService: SweetAlertService,
    private tracking: MixpanelService,
    private analytics: AnalyticsService,
    private projectService: ContentProjectService,
    private requeueService: RequeueService
  ) {
    this.organisation = new Organisation();
    this.organisation.CurrentPlan = new OrganisationPaymentPlan();
    this.organisationUsers = new OrganisationUsers();
    this.planDetails = new PricingPlan();
  }

  ngOnInit() {
    this.isLoading = true;

    // Load the current users organisation
    this.orgService.get().subscribe(
      response => {
        console.log('[ORG] Loaded organisation', response);
        this.updateOrganisationData(response);
        this.isLoading = false;
      },
      error => {
        console.log('Error loading organisation', error);
        this.isLoading = false;
        this.tracking.TrackError('Error occurred loading organisation data', error);
      });
  }

  // Called when the organisation is updated, makes sure all fields are filled in correctly
  public updateOrganisationData(data: Organisation) {
    // Store data
    this.isLoading = true;
    this.organisation = data;
    this.userAllowance = this.organisation.CurrentPlan.MaxUsers;
    this.amountToCharge = this.calcAmountToCharge();
    this.discountAmountPerMonth = this.monthlyChargeWithDiscount();
    this.offerTerms = this.calcTerms();
    this.discountTerms = this.calcDiscountTerms();
    this.planDetails = environment.plans.find(p => p.id === data.CurrentPlan.PlanId);

    // Show sections
    this.isLoading = false;
  }

  private calcAmountToCharge(): number {
    // Calculate the cost of the plan
    const planCost = this.organisation.CurrentPlan.MonthlyCharge;
    const discount = this.calcAmountToDiscountPerMonth(planCost);
    return Math.floor(planCost - discount);
  }

  private calcTerms(): string {
    let msg = '';

    // If there is no offer on the organisation retun nothing
    if (!this.organisation.CurrentPlan.Discount) { return ''; };

    // Type of discount
    if (this.organisation.CurrentPlan.Discount.PercentageOff) { msg += `${this.organisation.CurrentPlan.Discount.PercentageOff}% off `; }
    if (this.organisation.CurrentPlan.Discount.AmountOff) { msg += `£${this.organisation.CurrentPlan.Discount.AmountOff / 100.00} off `; }

    switch (this.organisation.CurrentPlan.Discount.Duration.toLocaleLowerCase()) {
      case 'once':
        msg += 'for one month ';
        break;
      case 'repeating':
      case 'multi-month':
        msg += `for ${this.organisation.CurrentPlan.Discount.DurationMonths} months `;
        break;
      case 'forever':
        msg += `forever `;
        break;
    }

    return msg.trim();
  }

  private monthlyChargeWithDiscount(): number {
    // Calculate the cost of the plan
    const planCost = this.organisation.CurrentPlan.MonthlyCharge * this.organisation.CurrentPlan.MaxUsers;
    const discount = this.calcAmountToDiscountPerMonth(planCost);
    return Math.floor(planCost - discount);
  }

  private calcAmountToDiscountPerMonth(planCost: number): number {
    // Calculate any discount the user has
    if (this.organisation.CurrentPlan.Discount) {
      const coupon = this.organisation.CurrentPlan.Discount;
      if (coupon.AmountOff) {
        // Fixed amount discount per month
        this.discountAmountPerMonth = coupon.AmountOff;
      }
      else {
        // Percentage discount per month
        this.discountAmountPerMonth = (planCost * (coupon.PercentageOff / 100));
      }
      // Return amount to discount
      return this.discountAmountPerMonth;
    } else {
      // No discount
      return 0;
    }
  }

  private calcDiscountTerms(): string {
    if (!this.organisation.CurrentPlan.Discount) { return ''; }

    let msg = '';
    // Type of discount
    if (this.organisation.CurrentPlan.Discount.PercentageOff) { msg += `${this.organisation.CurrentPlan.Discount.PercentageOff}% off `; }
    if (this.organisation.CurrentPlan.Discount.AmountOff) { msg += `£${this.organisation.CurrentPlan.Discount.AmountOff / 100.00} off `; }

    switch (this.organisation.CurrentPlan.Discount.Duration.toLocaleLowerCase()) {
      case 'once':
        msg += 'for one month ';
        break;
      case 'repeating':
      case 'multi-month':
        msg += `for ${this.organisation.CurrentPlan.Discount.DurationMonths} months `;
        break;
      case 'forever':
        msg += `forever `;
        break;
    }

    return msg.trim();
  }


  showChangePlanModal() {
    $(`#ChangePlanModal`).modal('show');
  }

  async changeToPlan(planId: string) {
    console.log('Change to plan', planId);
    this.hideChangePlanModal();

    const plan = environment.plans.find(p => p.id === planId);

    // Check the user doesn't have to many projects
    const projects = await this.projectService.getProjects().toPromise();
    if (projects.length > plan.maxProjects) {
      // The user has too many projects
      this.toast.error(`You currently have ${projects.length} projects, the plan you have selected only allows you to have ${plan.maxProjects}. Please delete your un-needed projects before you change your plan`, 'To many projects');
      return;
    }

    // Check requeues
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const requeues = await this.requeueService.getAll(project.id).toPromise();
      if (requeues.length > plan.maxRequeues) {
        this.toast.error(`You currently have ${requeues.length} requeues in project ${project.Title}, the plan you have selected only allows you to have ${plan.maxRequeues}. Please reduce the number of requeues in all projects then change your plan`, 'To many requeues');
        return;
      }
    }

    // All OK, confirm the user wants to change
    this.alertService.swal({
      title: 'Change plan',
      text: 'Are you sure you want to change your plan?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change plan!'
    }).then(() => {
      // Confirmed, change plan
      this.isLoading = true;
      this.orgService.changePlan(planId).toPromise().then(response => {
        this.toast.success('The subscription has been changed to the new plan', 'Plan changed');
        this.updateOrganisationData(response);
        this.organisationUpdate.emit(response);
      });
    },
      error => { }
    );
  }

  hideChangePlanModal() {
    $(`#ChangePlanModal`).modal('hide');
  }


  // The user has updated their subscription
  subscriptionPaid(token: string) {
    this.tracking.Track(MixpanelEvent.Update_subscription);
    this.analytics.Event_PaidForSubscription(this.amountToCharge);
    this.isLoading = true;

    let subscriptionUpdate = new PaymentInfo();
    subscriptionUpdate.numberOfUsers = this.userAllowance;
    subscriptionUpdate.paymentToken = token;

    // Update subscription
    this.orgService.paySubscription(subscriptionUpdate).subscribe(
      response => {
        console.log('Subscription updated', response);
        this.updateOrganisationData(response);
        this.organisationUpdate.emit(response);
        this.toast.success('Your subscription has been successfully updated. Thank you', 'Subscription updated');
      },
      error => {
        console.log('Error updating subscription', error);
        this.isLoading = false;
        this.toast.error('Sorry. Unable to update your subscription');
        this.tracking.TrackError('Error occurred while updating subscription', error);
      }
    );
  }

  // The user wants to cancel their subscription
  cancelSubscription() {
    this.tracking.Track(MixpanelEvent.Cancel_subscription);
    console.log('Cancel subscription');
    this.alertService.swal({
      title: 'Cancel subscription',
      text: 'Are you sure you want to cancel your subscription? At the end of your billing period you will loose access to all of your hard work',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel subscription!'
    }).then(() => {
      console.log('OK');
      this.isLoading = true;
      this.orgService.cancelSubscription().subscribe(
        response => {
          console.log('Subscription cancelled');
          this.updateOrganisationData(response);
          this.organisationUpdate.emit(response);
          this.toast.warning('Your subscription has been cancelled, it will no longer be available at the end of your billing period', 'Subscription cancelled');
          this.tracking.Track(MixpanelEvent.Cancel_subscription_confirmed);
        },
        error => {
          console.log('Error occurred while trying to cancel subscription', error);
          this.isLoading = false;
          this.toast.error('Unable to cancel your subscription at the moment, please try again later');
          this.tracking.TrackError('Error occurred while trying to cancel subscription', error);
        }
      );
    }).catch(() => {
      console.log('cancel');
    });
  }


  updateUsers() {
    console.log('Update users');
    const orgUserCount: number = this.organisation.AdminUsers.length + this.organisation.Users.length;

    // The user wants to have less users than they currently have
    if (this.userAllowance < orgUserCount) {
      // The user wants less users than they currently have
      this.alertService.swal('To many users', `You cannot reduce the subscription to <strong>${this.userAllowance}</strong> users because you currently have <strong>${orgUserCount}</strong> users in your organisation. <br/><br/>Remove the ones you don't need and try again`, 'error');
      this.userAllowance = this.organisation.CurrentPlan.MaxUsers;
      return;
    }

    // Update the allowance

    // The user is active, ask if they want to update the subscription
    this.alertService.swal({
      title: 'Update subscription?',
      text: `Are you sure you want up change your user allowance from <strong>${this.organisation.CurrentPlan.MaxUsers}</strong> users to <strong>${this.userAllowance}</strong> users?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update my subscription!'
    }).then(() => {
      console.log('Upgrade subscription');
      this.tracking.Track(MixpanelEvent.Update_subscription);

      // Update the subscription
      this.isLoading = true;
      this.orgService.updateSubscriptionAllowance(this.userAllowance).subscribe(
        response => {
          this.updateOrganisationData(response);
          this.organisationUpdate.emit(response);
          this.toast.success('User allowance updated');
        },
        error => {
          console.log('Error occurred updating the users allowance', error);
          this.tracking.TrackError('Error occurred updating the users allowance', error);
          this.toast.error('Sorry, an error occurred while updating your allowance', 'Error occurred');
        }
      );
    })
      .catch(() => {
        console.log('Cancel');
        return;
      });
  }




}
