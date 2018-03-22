import { Component, OnDestroy, OnInit, } from '@angular/core';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { TourService } from 'services/tour.service';

@Component({
  selector: 'starter',
  templateUrl: 'starter.template.html'
})
export class StarterViewComponent implements OnDestroy, OnInit {

  public nav: any;

  public constructor(private mixpanel: MixpanelService, private tour: TourService) {
    this.nav = document.querySelector('nav.navbar');
  }

  public ngOnInit(): any {
    this.mixpanel.Track(MixpanelEvent.Home);
    this.nav.className += ' white-bg';

    var steps = [
      {
        element: '#tour_Welcome',
        title: 'Welcome',
        content: 'Welcome to Otta.<br/><br/>It\'s time to take control of your content. Otta is here to help you every step of the way from creating the content to analysing the result.',
        placement: 'bottom'
      },
      {
        element: '#tour_Agenda',
        title: 'Your agenda for the day',
        content: 'See what you need to deal with today. This is a <strong>Demo idea</strong> for the moment.',
        placement: 'left',
        backdrop: true,
        backdropContainer: '#wrapper'
      }
    ];

    this.tour.init(steps);
  }


  public ngOnDestroy(): any {
    this.nav.classList.remove('white-bg');
    this.tour.clear();
  }

}
