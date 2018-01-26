import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "services/auth.service";
import { UserDataService } from 'services/user-data.service';

/// Protects the system routes from unauthorised users
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.auth.isAuthenticated()) {
      return true
    }

    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable()
export class OrganisationAdminGuard implements CanActivate {
  constructor(private userDataService: UserDataService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.userDataService.userIsOrgAdmin) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
