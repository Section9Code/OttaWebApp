import { Component } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'in-active',
    templateUrl: 'in-active.component.html',
    styleUrls: ['in-active.component.scss']
})
export class InActiveComponent {

    constructor(private authService: AuthService, public router: Router) { 
        // Automatically logout anyone who comes to this page
        this.authService.logout(false);
    };

    login()
    {
        this.router.navigate(['/login']);
    }

}
