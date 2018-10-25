import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class OrganisationService {
  private url: string = environment.baseApiUrl + '/api/organisation';

  constructor(private authHttp: AuthHttp) { }

  // Get the current users organisation
  get(): Observable<Organisation> {
    return this.authHttp.get(this.url).map(response => response.json());
  }

  getInvoices(): Observable<Invoice[]> {
    return this.authHttp.get(`${this.url}/subscription/invoices`).map(response => response.json());
  }

  // Pay for a change to the users subscription
  paySubscription(details: PaymentInfo): Observable<Organisation> {
    return this.authHttp.post(`${this.url}/subscription`, details).map(response => response.json());
  }

  // Pay for a change to the users subscription
  updateSubscriptionAllowance(numberOfUsers: number): Observable<Organisation> {
    return this.authHttp.post(`${this.url}/subscription/users`, new UserInfo(numberOfUsers)).map(response => response.json());
  }

  // Cancel the subscription on an organisation
  cancelSubscription(): Observable<Organisation> {
    return this.authHttp.delete(`${this.url}/subscription`).map(response => response.json());
  }

  // Get all the users in the organisation
  getUsers(): Observable<OrganisationUsers> {
    return this.authHttp.get(`${this.url}/users`).map(response => response.json());
  }

  // Invite a user
  inviteUser(userEmail: string): Observable<boolean> {
    return this.authHttp.get(`${this.url}/users/invite?email=${encodeURI(userEmail)}`).map(response => response.json());
  }

  // Remove a user
  removeUser(authId: string): Observable<Organisation> {
    return this.authHttp.delete(`${this.url}/users/${authId}`).map(response => response.json());
  }

  // Make a user an admin
  makeAdmin(authId: string): Observable<Organisation> {
    return this.authHttp.post(`${this.url}/users/${authId}/makeAdmin`, null).map(response => response.json());
  }

  // Revoke admin from user
  revokeAdmin(authId: string): Observable<Organisation> {
    return this.authHttp.post(`${this.url}/users/${authId}/revokeAdmin`, null).map(response => response.json());
  }

  // Is the current user an organisation admin
  isOrganisationAdmin(): Observable<boolean> {
    return this.authHttp.get(`${this.url}/isOrganisationAdmin`).map(response => response.json());
  }
}

export class PaymentInfo {
  numberOfUsers: number;
  paymentToken: string;
}

export class UserInfo {
  numberOfUsers: number;

  constructor(userCount: number) {
    this.numberOfUsers = userCount;
  }
}

export class Organisation {
  Name: string;
  CurrentPlan: OrganisationPaymentPlan;
  IsActive: boolean;

  AdminUsers: string[];
  Users: string[];
  Authors: string[];
}

export class OrganisationPaymentPlan {
  PlanName: string;
  IsTrialPlan: boolean;
  PlanExpires: Date;
  PaymentProcessorPlanId: string;
  Created: Date;
  CustomerId: string;
  SubscriptionId: string;
  Status: string;
  TrialStart: Date;
  TrialEnd: Date;
  MaxUsers: number;
  MaxProjects: number;
  MaxRequeues: number;
  CurrentPeriodStart: Date;
  CurrentPeriodEnd: Date;
  MonthlyCharge: number;
  Discount: PaymentPlanDiscountModel;
}

export class PaymentPlanDiscountModel {
  DiscountStart: Date;
  DiscountEnd: Date;
  CouponName: string;
  AmountOff: number;
  PercentageOff: number;
  Duration: string;
  DurationMonths: number;
}

export class OrganisationUsers {
  AdminUsers: OrganisationUser[];
  NormalUsers: OrganisationUser[];
  CreativeUsers: OrganisationUser[];
}

export class OrganisationUser {
  AuthId: string;
  Name: string;
  Email: string;
  IsActive: boolean
}

export class OrganisationUsersHelper {
  org: OrganisationUsers;

  public constructor(data: OrganisationUsers) {
    this.org = data;
  }

  // Count all the users of an organisation
  public countAllUsers(): number {
    return this.org.AdminUsers.length + this.org.NormalUsers.length;
  }

  // Count all the active users of an organisation
  public countAllActiveUsers(): number {
    let activeAdmins = this.org.AdminUsers.filter(user => user.IsActive).length;
    let activeUsers = this.org.NormalUsers.filter(user => user.IsActive).length;
    return activeAdmins + activeUsers;
  }
}

export class Invoice {
  public Reference: string;
  public Created: Date;
  public Due: Date;
  public Amount: number;
  public Status: string;
  //public InvoiceLine[] InvoiceLines { get; set; }
}