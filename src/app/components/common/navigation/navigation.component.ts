import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'jquery-slimscroll';
import { AuthService, Auth0Profile } from "services/auth.service";
import { UserDataService } from 'services/user-data.service';
import { ContentProjectModel } from 'services/content-project.service';
import { TourService } from 'services/tour.service';

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

  constructor(private router: Router, private auth: AuthService, private userDataService: UserDataService) { }

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

    // Listen to changes to the users options
    this.userDataService.showCreatorOptionsSubject.subscribe(
      response => {
        console.log('Users creator options changed', response);
        this.showCreatorOptions = response;
      }
    );

    this.userDataService.showOrganisationOptionsSubject.subscribe(
      response => {
        console.log('Users organisation options changed', response);
        this.showOrganisationOptions = response;
      }
    );

    this.userDataService.usersContentProjectsSubject.subscribe(
      response => {
        console.log('Nav: Users content projects changed', response);
        this.usersContentProjects = response;
      }
    );
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
