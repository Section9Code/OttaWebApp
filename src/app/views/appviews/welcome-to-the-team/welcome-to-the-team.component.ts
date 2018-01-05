import { Component, OnInit } from '@angular/core';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { Router } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { WelcomeService, WelcomeModel } from 'services/welcome.service';

@Component({
    moduleId: module.id,
    selector: 'welcome-to-the-team',
    templateUrl: 'welcome-to-the-team.component.html',
    styleUrls: ['welcome-to-the-team.component.scss']
})
export class WelcomeToTheTeamComponent implements OnInit {
    signupComplete: boolean = false;
    isUpdatingData: boolean = false;
    data: WelcomeModel = new WelcomeModel();

    constructor(private tracking: MixpanelService, private router: Router, private authService: AuthService, private welcomeService: WelcomeService) {
    }

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.WelcomeToTheTeam);

        // Load data about the user
        this.welcomeService.getData().subscribe(
            response => {
                console.log("Loaded data", response);
                this.data = response;
                this.data.MarketingOptIn = true;
            },
            error => {
                console.log("Error occurred while loading welcome data", error);
                this.router.navigate(['/problem']);
            }
        );
    }

    completeSetup() {
        console.log("Complete setup");
        this.isUpdatingData = true;

        // Update the users details
        this.welcomeService.updateData(this.data).subscribe(
            response => {
                console.log("Data sent", response);
                this.isUpdatingData = false;
                this.signupComplete = true;
            },
            error => {
                console.log("Error loading data", error);
                this.router.navigateByUrl("/problem");
            }
        );
    }

    public next() {
        this.tracking.Track(MixpanelEvent.WelcomeToTheTeam, { Action: "next" })
        this.router.navigateByUrl('/');
    }

    public skip() {
        this.tracking.Track(MixpanelEvent.WelcomeToTheTeam, { Action: "skip" })
        this.router.navigateByUrl('/');
    }
}
