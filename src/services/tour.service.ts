import { Injectable } from '@angular/core';
import { SweetAlertService } from 'ng2-sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environments/environment';

/* 
    Based on Bootstrap-tour
    Go here for detais: http://bootstraptour.com/api/
*/

declare var Tour: any;

@Injectable()
export class TourService {
    currentTourSteps: any;
    currentTour: any;
    currentTourUrl = '';

    private url: string = environment.baseApiUrl + '/api/tour';

    // tslint:disable-next-line:max-line-length
    popoverHtml = '<div class="popover tour-tour tour-tour-0 fade top in" role="tooltip" id="step-0" style="top: 82px; left: 811.25px; display: block;"> <div class="arrow" style="left: 50%;"></div> <h3 class="popover-title">Title of my step</h3> <div class="popover-content">Introduce new users to your product by walking them through it step by step.</div> <div class="popover-navigation"> <div class="btn-group"> <button class="btn btn-sm btn-default disabled" data-role="prev">« Prev</button> <button class="btn btn-sm btn-default" data-role="next">Next »</button>  </div> <button class="btn btn-sm btn-default" data-role="end">End tour</button> </div> </div>'

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authHttp: AuthHttp,
        private alertSvc: SweetAlertService
    ) { }

    // Starts a tour of the page
    async show() {
        const pageUrl = this.processUrl(this.router.url);
        console.log(`Showing tour [${pageUrl}]`);

        if (this.currentTourUrl !== pageUrl) {
            // Load the tour for this page
            this.currentTourUrl = pageUrl;
            this.currentTourSteps = await this.loadSteps(this.currentTourUrl);

            // Setup the tour object
            this.currentTour = new Tour({
                steps: this.currentTourSteps,
                template: this.popoverHtml
            });
        }

        // Start the tour (only if there are steps to show. Otherwise tell the user there is not help for this page yet).
        if (this.currentTourSteps != null && this.currentTourSteps.length > 0) {
            this.currentTour.restart();
        } else {
            this.alertSvc.swal('Help is coming', 'We have not setup help on this page yet, but it is coming', 'info');
        };
    }

    // Takes the pages full URL and converts it to be used to find a guide
    processUrl(url: string): string {
        let parts = url.split('/');
        let cleanUrl = '';

        // Add initial slash
        cleanUrl += '/';
        for (let i = 1; i < parts.length; i++) {
            let thisPart = parts[i];

            // Check if this part is a number
            if (this.isNumeric(thisPart)) { thisPart = '*'; }
            if (this.isGuid(thisPart)) { thisPart = '*'; }

            // Add the part to the url
            cleanUrl += `${thisPart}`;

            if(i !== parts.length - 1)
            {
                // Add trailing slash but not to the last item
                cleanUrl += '/';
            }
        }

        return cleanUrl;
    }

    // Checks if a string is just a numeric value
    private isNumeric(value) {
        return /^\d+$/.test(value);
    }

    // Checks if a string is a guid
    private isGuid(value) {
        const parts = value.split('-');
        if (parts.length === 5) { return true; }
        return false;
    }

    // Load the tour steps for the users current page
    private loadSteps(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            // Load the steps for this url
            this.authHttp.get(`${this.url}?path=${url}`).toPromise().then(response => {
                // Found the steps for this tour
                resolve(response.json());
            })
                .catch(() => {
                    // Unable to find the tour for this page, return an empty tour
                    resolve([]);
                });
        });
    }
}
