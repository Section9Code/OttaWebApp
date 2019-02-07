import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { EBADF } from 'constants';

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
        console.log('[GA] Track page', url);
        (<any>window).ga('set', 'page', url);
        (<any>window).ga('send', 'pageview');
    }

    // Track the user ID for the user who has logged in
    public AssignUser(authId: string) {
        // Only production environments
        if (!environment.production) { return; }

        console.log('[GA] Assign user', authId);
        (<any>window).ga('set', 'userId', authId);
    }

    public Event(category: string, action: string, label: string, value: number = 1) {
        // Only production environments
        if (!environment.production) { return; }

        // Send event
        console.log('[GA] Send event', [category, action]);
        (<any>window).ga('send', 'event', category, action, label, value);
    }

    public Event_NewUser() {
        this.Event('user', 'new', 'welcome');
    }

    public Event_PaidForSubscription(amount: number) {
        this.Event('subscription', 'paid', 'paid', amount);
    }

}
