import { Component } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'subscription-error',
    templateUrl: 'subscription-error.component.html',
    styleUrls: ['subscription-error.component.scss']
})
export class SubscriptionErrorComponent {

    constructor(private authService: AuthService, public router: Router) { 
        // Automatically logout anyone who comes to this page
        this.authService.logout(false);
    };

    login()
    {
        this.router.navigate(['/login']);
    }

}
