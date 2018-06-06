import { Component, OnInit, transition } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { OrganisationService, Organisation, OrganisationPaymentPlan, PaymentInfo, OrganisationUsers, OrganisationUsersHelper, OrganisationUser, Invoice } from 'services/organisation.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ToastsManager } from 'ng2-toastr';
import { environment } from 'environments/environment';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';

@Component({
    moduleId: module.id,
    selector: 'organisation-overview',
    templateUrl: 'organisation-overview.component.html',
    styleUrls: ['organisation-overview.component.scss']
})
export class OrganisationOverviewComponent implements OnInit {

    // Display flags
    isLoading: boolean = false;
    isLoadingUsers: boolean = false;
    isLoadingInvoices: boolean = false;
    hideOrgDetails: boolean = true;
    orgNotAvailable: boolean = false;

    // Organisation data
    organisation: Organisation;
    organisationUsers: OrganisationUsers;
    invoices: Invoice[]
    userAllowance: number;

    amountToCharge: number;
    offerTerms: string;
    discountAmountPerMonth: number;
    discountTerms: string;

    inviteUserEmail: string;

    constructor(private authService: AuthService, private orgService: OrganisationService, private toast: ToastsManager, private alertService: SweetAlertService, private tracking: MixpanelService) {
        this.organisation = new Organisation();
        this.organisation.CurrentPlan = new OrganisationPaymentPlan();
        this.organisationUsers = new OrganisationUsers();
    }

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.View_organisation_admin);
        this.isLoading = true;

        // Load the current users organisation
        this.orgService.get().subscribe(
            response => {
                console.log("Loaded organisation", response);
                this.updateOrganisationData(response);
            },
            error => {
                console.log("Error loading organisation", error);
                this.isLoading = false;
                this.orgNotAvailable = true;
                this.tracking.TrackError("Error occurred loading organisation data", error);
            }
        );

        this.UpdateOrganisationUsers();
        this.UpdateInvoices();
    }

    UpdateOrganisationUsers() {
        // Load organisation users
        this.isLoadingUsers = true;
        this.orgService.getUsers().subscribe(
            response => {
                console.log("Loaded organisation users", response);
                this.organisationUsers = response;
                this.isLoadingUsers = false;
            },
            error => {
                console.log("Error retrieving users", error);
                this.tracking.TrackError("Error occurred loading organisation users", error);
                this.isLoadingUsers = false;
            }
        );
    }

    UpdateInvoices() {
        // Load invoices
        this.isLoadingInvoices = true;
        this.orgService.getInvoices().subscribe(
            response => {
                console.log("Loaded invoices", response);
                this.invoices = response;
                this.isLoadingInvoices = false;
            },
            error => {
                console.log("Error retrieving invoices", error);
                this.tracking.TrackError('Error occurred loading organisation invoices', error);
                this.isLoadingUsers = false;
            }
        );
    }

    // Called when the organisation is updated, makes sure all fields are filled in correctly
    updateOrganisationData(data: Organisation) {
        // Store data
        this.organisation = data;
        this.userAllowance = this.organisation.CurrentPlan.MaxUsers;
        this.discountAmountPerMonth
        this.amountToCharge = this.calcAmountToCharge();
        this.discountAmountPerMonth = this.monthlyChargeWithDiscount();
        this.offerTerms = this.calcTerms();
        this.discountTerms = this.calcDiscountTerms();

        // Show sections
        this.isLoading = false;
        this.isLoadingUsers = false;
        this.hideOrgDetails = false;
    }

    calcAmountToCharge(): number {
        // Calculate the cost of the plan
        let planCost = this.organisation.CurrentPlan.MonthlyCharge * this.organisation.CurrentPlan.MaxUsers;

        // Calculate any discount the user has
        if (this.organisation.Offer) {
            const coupon = this.organisation.Offer;
            if (coupon.AmountOff) {
                planCost = planCost - coupon.AmountOff;
            }
            else {
                planCost = planCost * (coupon.PercentageOff / 100);
            }
        }

        return Math.floor(planCost);
    }

    calcTerms(): string {
        let msg = '';

        // If there is no offer on the organisation retun nothing
        if (!this.organisation.Offer) { return ''; };

        // Type of discount
        if (this.organisation.Offer.PercentageOff) { msg += `${this.organisation.Offer.PercentageOff}% off `; }
        if (this.organisation.Offer.AmountOff) { msg += `£${this.organisation.Offer.AmountOff / 100.00} off `; }

        switch (this.organisation.Offer.Duration.toLocaleLowerCase()) {
            case 'once':
                msg += 'for one month ';
                break;
            case 'repeating':
            case 'multi-month':
                msg += `for ${this.organisation.Offer.DurationMonths} months `;
                break;
            case 'forever':
                msg += `forever `;
                break;
        }

        return msg.trim();
    }

    monthlyChargeWithDiscount(): number {
        // Calculate the cost of the plan
        let planCost = this.organisation.CurrentPlan.MonthlyCharge * this.organisation.CurrentPlan.MaxUsers;

        // Calculate any discount the user has
        if (this.organisation.CurrentPlan.Discount) {
            const coupon = this.organisation.Offer;
            if (this.organisation.CurrentPlan.Discount.AmountOff) {
                planCost = planCost - this.organisation.CurrentPlan.Discount.AmountOff;
            } else {
                planCost = planCost * (this.organisation.CurrentPlan.Discount.PercentageOff / 100);
            }
        }

        return Math.floor(planCost);
    }

    calcDiscountTerms(): string {
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

    // The user has updated their subscription
    subscriptionPaid(token: string) {
        this.tracking.Track(MixpanelEvent.Update_subscription);
        this.isLoading = true;
        this.hideOrgDetails = true;

        let subscriptionUpdate = new PaymentInfo();
        subscriptionUpdate.numberOfUsers = this.userAllowance;
        subscriptionUpdate.paymentToken = token;

        // Update subscription
        this.orgService.paySubscription(subscriptionUpdate).subscribe(
            response => {
                console.log('Subscription updated', response);
                this.updateOrganisationData(response);
                this.toast.success('Your subscription has been successfully updated. Thank you', 'Subscription updated');
            },
            error => {
                console.log('Error updating subscription', error);
                this.isLoading = false;
                this.hideOrgDetails = false;
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
            this.hideOrgDetails = true;
            this.orgService.cancelSubscription().subscribe(
                response => {
                    console.log('Subscription cancelled');
                    this.updateOrganisationData(response);
                    this.toast.warning('Your subscription has been cancelled, it will no longer be available at the end of your billing period', 'Subscription cancelled');
                    this.tracking.Track(MixpanelEvent.Cancel_subscription_confirmed);
                },
                error => {
                    console.log('Error occurred while trying to cancel subscription', error);
                    this.isLoading = false;
                    this.hideOrgDetails = false;
                    this.toast.error('Unable to cancel your subscription at the moment, please try again later');
                    this.tracking.TrackError('Error occurred while trying to cancel subscription', error);
                }
            );
        }).catch(() => {
            console.log('cancel');
        });
    }

    // Invite a new user to join this organisation
    inviteUser() {
        this.tracking.Track(MixpanelEvent.Invite_user);

        if (this.inviteUserEmail) {
            console.log('Invite user', this.inviteUserEmail);

            // Check the user has enough capacity to add the user
            console.log('Current org users', this.organisationUsers);
            let helper = new OrganisationUsersHelper(this.organisationUsers);
            if (helper.countAllActiveUsers() >= this.userAllowance) {

                // User doesn't have enough allowed users, ask if they want to up their subscription
                console.log('Organisation doesn\'t have enough users on its subscription');
                switch (this.organisation.CurrentPlan.Status) {
                    case 'trialing':
                        // The user is in trial mode, update the subscription automatically
                        console.log('User is in trial mode, automatically update the subscription');
                        this.upgradeSubscriptionAndInvite();
                    case 'active':
                        // The user is active, ask if they want to update the subscription
                        this.alertService.swal({
                            title: 'Upgrade subscription?',
                            text: `Your current user limit is <strong>${this.userAllowance}</strong>.<br/><br/>To add another user you must either make a current user inactive or add a user to your subscription`,
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, add user to my subscription!'
                        }).then(() => {
                            console.log('OK');
                            this.tracking.Track(MixpanelEvent.Invite_user_confirmed);
                            this.upgradeSubscriptionAndInvite();
                        })
                            .catch(() => {
                                console.log('Cancel');
                                this.tracking.Track(MixpanelEvent.Invite_user_cancelled);
                            });
                }
            }
            else {
                // Invite user
                this.sendInvite();
            }
        }
    }

    // Adds 1 users to the users subscription then invites a user to join
    private upgradeSubscriptionAndInvite(): void {
        // Upgrade the users allowance
        this.orgService.updateSubscriptionAllowance(++this.userAllowance).subscribe(
            response => {
                this.updateOrganisationData(response);
                this.toast.success(`Subscription updated. You can now have ${this.userAllowance} users`, 'Subscription updated');
                this.sendInvite();
            },
            error => {
                this.toast.error('Error occurred updating the subscription');
                this.tracking.TrackError('Error occurred updating the organisation subscription', error);
            }
        );
    }

    private sendInvite(): void {
        // Invite the user
        console.log('Invite user', this.inviteUserEmail);
        this.orgService.inviteUser(this.inviteUserEmail).subscribe(
            response => {
                this.toast.success(`${this.inviteUserEmail} has been invited to join your organisation`, 'Invite user');
                this.inviteUserEmail = '';
            },
            error => {
                console.log('Error occurred trying to invite user', this.inviteUserEmail);
                this.tracking.TrackError('Error occurred trying to invite user', error);
                this.toast.error(`Unable to invite user ${this.inviteUserEmail}`);
            }
        );
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
            this.hideOrgDetails = true;
            this.orgService.updateSubscriptionAllowance(this.userAllowance).subscribe(
                response => {
                    this.updateOrganisationData(response);
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

    // User wants to remove a user from the application
    removeUser(user: OrganisationUser) {
        console.log('Remove user', user);

        // Is the user being removed the current user
        if (user.AuthId == this.authService.currentUserAuthId()) {
            // The user cannot remove them self
            this.toast.error('You cannot remove yourself from the organisation, you must have another admin do it for you.', 'Unable to remove yourself');
            return;
        }

        this.alertService.swal({
            title: 'Remove user',
            text: `Are you sure you want to remove this user?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove user'
        }).then(() => {
            console.log('OK');
            this.orgService.removeUser(user.AuthId).subscribe(
                response => {
                    console.log('User removed', response);
                    this.updateOrganisationData(response);
                    this.UpdateOrganisationUsers();
                    this.toast.success('User removed');
                },
                error => {
                    console.log('Error occurred', error);
                    this.toast.error('Error occurred removing', 'Unable to remove user');
                    this.tracking.TrackError(`Error occurred removing user ${user.AuthId}`, error);
                }
            );
        })
            .catch(() => {
                console.log('Cancel');
                return;
            });
    }

    makeAdmin(user: OrganisationUser) {
        console.log('Make a user an admin', user);

        this.orgService.makeAdmin(user.AuthId).subscribe(
            response => {
                console.log('User updated', response);
                this.updateOrganisationData(response);
                this.UpdateOrganisationUsers();
                this.toast.success('User has been made into an admin', 'User updated');
            },
            error => {
                console.log('Error occurred', error);
                this.toast.error('Error occurred updating user', 'Unable to update user');
                this.tracking.TrackError(`Error occurred making user ${user.AuthId} an admin`, error);
            }
        );
    }

    removeAdmin(user: OrganisationUser) {
        console.log('Remove admin from user', user);

        // Is the user being removed the current user
        if (user.AuthId == this.authService.currentUserAuthId()) {
            // The user cannot remove them self
            this.toast.error('You cannot remove admin rights from yourself, you must have another admin do it for you.', 'Unable to remove administrator');
            return;
        }

        this.orgService.revokeAdmin(user.AuthId).subscribe(
            response => {
                console.log('User updated', response);
                this.updateOrganisationData(response);
                this.UpdateOrganisationUsers();
                this.toast.success('User has had admin rights revoked', 'User updated');
            },
            error => {
                console.log('Error occurred', error);
                this.toast.error('Error occurred updating user', 'Unable to update user');
                this.tracking.TrackError(`Error occurred revoking admin from user${user.AuthId}`, error);
            }
        );
    }



}
