import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

// Uses google analytics to track users around the application
@Injectable()
export class AnalyticsService {

    // Track the visit to a page
    public TrackPageVisit(url: string) {
        // Only production environments
        if (!environment.production) { return; }

        // Ignore pages
        if (url.startsWith('/callback')) { return; }
        
        // Track the page view
        (<any>window).ga('set', 'page', url);
        (<any>window).ga('send', 'pageview');
    }

    // Track the user ID for the user who has logged in
    public AssignUser(authId: string) {
        // Only production environments
        if (!environment.production) { return; }
        // Send
        (<any>window).ga('set', 'userId', authId);
    }

    public GA_Event(category: string, action: string, label: string, value: number = 1) {
        // Only production environments
        if (!environment.production) { return; }
        // Send
        (<any>window).ga('send', 'event', category, action, label, value);
    }

    private FB_TrackNewUser() {
        // Only production environments
        if (!environment.production) { return; }
        // Send
        (<any>window).fbq('track', 'StartTrial', { value: 1, currency: 'GBP' });
    }

    private FB_TrackPaidForSubscription(amount: number) {
        // Only production environments
        if (!environment.production) { return; }
        // Send
        (<any>window).fbq('track', 'Purchase', { value: amount, currency: 'GBP' });
    }

    public Event_NewUser() {
        this.GA_Event('user', 'new', 'welcome');
        this.FB_TrackNewUser();
    }

    public Event_PaidForSubscription(amount: number) {
        this.GA_Event('subscription', 'paid', 'paid', amount);
        this.FB_TrackPaidForSubscription(amount);
    }

}
