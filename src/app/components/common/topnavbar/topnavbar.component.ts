import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AuthService } from "services/auth.service";
declare var jQuery: any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {

  constructor(private auth: AuthService){}

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

}
