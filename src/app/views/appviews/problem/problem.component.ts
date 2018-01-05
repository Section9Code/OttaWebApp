import { Component, OnInit } from '@angular/core';

import { AuthService } from 'services/auth.service';

// Tells the user a problem occurred
@Component({
    moduleId: module.id,
    selector: 'problem',
    templateUrl: 'problem.component.html',
    styleUrls: ['problem.component.scss']
})
export class ProblemComponent implements OnInit {

    constructor(private authService: AuthService){        
    }

    ngOnInit(): void {
        // Log out the user if they are current logged in
        this.authService.logout();
    }
    
}
