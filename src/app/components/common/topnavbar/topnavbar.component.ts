import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AuthService } from "services/auth.service";
import { TourService } from 'services/tour.service';
import { Router } from '@angular/router';
declare var jQuery: any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {
  searchCriteria = '';

  constructor(
    private auth: AuthService,
    private tour: TourService,
    private router: Router
  ) { }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  showTour() {
    this.tour.show();
  }

  search() {
    console.log('Search - GO', this.searchCriteria);
    if (this.searchCriteria !== '') {
      this.router.navigateByUrl(`/content/search?s=${this.searchCriteria}`);
    }
  }
}
