import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { MixpanelService, MixpanelEvent } from "services/mixpanel.service";
import { AuthService } from 'services/auth.service';
import { WelcomeModel, WelcomeService } from 'services/welcome.service';

@Component({
    moduleId: module.id,
    selector: 'welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
    isLoading = false;
    signupComplete: boolean;
    currentStep: string;
    data: WelcomeModel;
    isUpdatingData: boolean;

    constructor(private mixpanel: MixpanelService, private router: Router, private authService:
        AuthService, private welcomeService: WelcomeService) { }

    ngOnInit(): void {
        this.mixpanel.Track(MixpanelEvent.Welcome);
        this.data = new WelcomeModel;
        this.signupComplete = false;
        this.currentStep = 'step1';

        // Get the data to show on the form
        this.isLoading = true;
        this.welcomeService.getData().subscribe(
            response => {
                console.log('Loaded data', response);
                this.data = response;
                this.isLoading = false;
            },
            error => {
                console.log(this.newMethod(), error);
                this.router.navigate(['/problem']);
            }
        );
    }

    private newMethod(): any {
        return 'Error occurred while loading welcome data';
    }

    public completeStep1() {
        console.log('Submit org details', this.data);
        this.currentStep = 'step2';
    }

    public completeStep2() {
        this.isUpdatingData = true;

        // Update the users details
        this.welcomeService.updateData(this.data).subscribe(
            response => {
                console.log('Data sent', response);
                this.isUpdatingData = false;
                this.signupComplete = true;
            },
            error => {
                console.log('Error loading data', error);
                this.router.navigateByUrl('/problem');
            }
        );
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