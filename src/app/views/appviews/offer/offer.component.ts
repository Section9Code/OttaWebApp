import { Component, OnInit, OnDestroy } from '@angular/core';
import { CouponService } from 'services/coupon.service';
import { JoinData } from '../join/join.component';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit, OnDestroy {
  offerCode: string;
  isLoading = false;
  message = '';

  subQuery: Subscription;

  constructor(
    private couponService: CouponService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tracking: MixpanelService) {
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      // User is already logged in, send them to the home page
      this.router.navigate(['/']);
    }

    // Track the user
    this.tracking.Track(MixpanelEvent.Offer);

    this.subQuery = this.route.queryParams.subscribe(params => {
      if (params && params.c) {
        this.offerCode = params.c;
      }
    });
  }

  ngOnDestroy() {
    if (this.subQuery) { this.subQuery.unsubscribe(); }
  }

  checkOffer() {
    console.log('Checking', this.offerCode);
    this.message = null;

    // Validate
    if (!this.offerCode) {
      this.message = 'Please enter valid message code';
      return;
    };

    // Check the offer
    this.isLoading = true;
    this.couponService.getOffer(this.offerCode).toPromise()
      .then(response => {
        this.isLoading = false;
        console.log('Found offer', response);
        this.tracking.TrackAction(MixpanelEvent.Offer, this.offerCode);
        // Let the user join and store the offer code
        const friendJoinData: JoinData = new JoinData('offer', '', '', false, true, response);
        localStorage.setItem('joinData', JSON.stringify(friendJoinData));
        this.auth.signup();
      })
      .catch(error => {
        this.isLoading = false;
        this.message = 'Offer not found';
      });

  }

}
