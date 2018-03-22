import { Injectable } from '@angular/core';
import { SweetAlertService } from 'ng2-sweetalert2';

/* 
    Based on Bootstrap-tour
    Go here for detais: http://bootstraptour.com/api/
*/

declare var Tour: any;

@Injectable()
export class TourService {
    currentTourSteps: any;
    currentTour: any;

    // tslint:disable-next-line:max-line-length
    popoverHtml = '<div class="popover tour-tour tour-tour-0 fade top in" role="tooltip" id="step-0" style="top: 82px; left: 811.25px; display: block;"> <div class="arrow" style="left: 50%;"></div> <h3 class="popover-title">Title of my step</h3> <div class="popover-content">Introduce new users to your product by walking them through it step by step.</div> <div class="popover-navigation"> <div class="btn-group"> <button class="btn btn-sm btn-default disabled" data-role="prev">« Prev</button> <button class="btn btn-sm btn-default" data-role="next">Next »</button>  </div> <button class="btn btn-sm btn-default" data-role="end">End tour</button> </div> </div>'

    constructor(private alertSvc: SweetAlertService){}

    // Sets up a tour to be shown
    init(steps: any) {
        this.currentTourSteps = steps;
        this.currentTour = new Tour({
            steps: this.currentTourSteps,
            template: this.popoverHtml
        });

        // Initialise the tour
        this.currentTour.init();

        // Start the tour
        this.currentTour.start();
    }

    // Starts a tour of the page
    show() {
        if (this.currentTour) {
            // Restart the current tour
            this.currentTour.restart();
        }
        else {
            // No tour to show
            this.alertSvc.swal('Help is coming', 'We have not setup help on this page yet, but it is coming', 'info');
        }
    }

    // Clears the current tour
    clear() {
        this.currentTourSteps = null;
        this.currentTour = null;
    }

}
