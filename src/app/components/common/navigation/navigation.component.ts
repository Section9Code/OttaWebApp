import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import 'jquery-slimscroll';
import { AuthService, Auth0Profile } from "services/auth.service";
import { UserDataService } from 'services/user-data.service';
import { ContentProjectModel } from 'services/content-project.service';
import { TourService } from 'services/tour.service';
import { ContentSearchLayoutComponent } from 'app/modules/contentModule/content-search-layout/content-search-layout.component';

declare var jQuery: any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements OnInit {
  // The users profile
  profile: Auth0Profile;

  showCreatorOptions = false;
  showOrganisationOptions = false;
  usersContentProjects: ContentProjectModel[] = [];

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    // Load the users profile
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
    } else {
      if (this.auth.isAuthenticated()) {
        this.auth.getProfile((err, profile) => {
          this.profile = profile;
        });
      }
    }

  }

  // Update the view after it has been setup
  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  // Check if a url route is the current one
  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  logout() {
    this.auth.logout();
  }

}
