import { Component } from '@angular/core';
import { AuthService } from 'services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'verify-email',
    templateUrl: 'verify-email.component.html'
})
export class VerifyEmailComponent {
    constructor(private authService: AuthService){}

    verify() {
        this.authService.login();
    }
}
