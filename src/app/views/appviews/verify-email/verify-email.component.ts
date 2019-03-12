import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';

@Component({
    moduleId: module.id,
    selector: 'verify-email',
    templateUrl: 'verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private mixpanel: MixpanelService
    ) { }

    ngOnInit() {
        this.mixpanel.Track(MixpanelEvent.NewAccountCreated);
    }

    verify() {
        this.authService.login();
    }
}
