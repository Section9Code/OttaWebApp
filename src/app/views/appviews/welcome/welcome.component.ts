import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import { MixpanelService, MixpanelEvent } from "services/mixpanel.service";
import { AuthService } from 'services/auth.service';
import { WelcomeModel, WelcomeService } from 'services/welcome.service';
import { Subscription } from 'rxjs/Subscription';
import { AnalyticsService } from 'services/analytics.service';

@Component({
    moduleId: module.id,
    selector: 'welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
    isLoading = false;
    signupComplete: boolean;
    currentStep: string;
    data: WelcomeModel;
    isUpdatingData: boolean;

    subWelcome: Subscription;

    constructor(
        private mixpanel: MixpanelService,
        private router: Router,
        private welcomeService: WelcomeService,
        private analytics: AnalyticsService) { }

    ngOnInit(): void {
        this.mixpanel.Track(MixpanelEvent.Welcome);
        this.mixpanel.Track(MixpanelEvent.NewAccountCreated);
        this.analytics.Event_NewUser();
        this.data = new WelcomeModel;
        this.signupComplete = false;
        this.currentStep = 'step2';

        // Get the data to show on the form
        this.isLoading = true;
        this.subWelcome = this.welcomeService.getData().subscribe(
            response => {
                console.log('Loaded data', response);
                this.data = response;
                this.isLoading = false;
            },
            error => {
                console.log('Error occurred while loading welcome data', error);
                this.router.navigate(['/problem']);
            }
        );
    }

    ngOnDestroy() {
        if (this.subWelcome) { this.subWelcome.unsubscribe(); }
    }

    public completeStep1() {
        console.log('Submit org details', this.data);
        this.currentStep = 'step2';
    }

    public completeStep2() {
        this.isUpdatingData = true;

        // Get the pricing option the user selected
        const option = localStorage.getItem('welcomeOption');

        // Set the organisation name if they user hasn't picked one
        if (this.data.OrganisationName === '') {
            this.data.OrganisationName = `${this.data.Name}'s Organisation`;
        }

        // Update the users details
        this.welcomeService.updateData(this.data).subscribe(
            response => {
                console.log('Data sent', response);
                this.mixpanel.Track(MixpanelEvent.WelcomeComplete);
                this.isUpdatingData = false;

                // Dis the user pick an option before signing up
                if (option) {
                    this.currentStep = 'step3';
                } else {
                    // No option picked, all done
                    this.signupComplete = true;
                }
            },
            error => {
                console.log('Error loading data', error);
                this.router.navigateByUrl('/problem');
            }
        );
    }

    public completeStep3() {
        console.log('Plan picked', this.data);
        this.currentStep = 'step2';
        this.signupComplete = true;
    }

    public next() {
        this.mixpanel.Track(MixpanelEvent.Welcome, { Action: 'next' });
        this.router.navigateByUrl('/');
    }

    public skip() {
        this.mixpanel.Track(MixpanelEvent.Welcome, { Action: 'skip' });
        this.router.navigateByUrl('/');
    }
}