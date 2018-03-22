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
        element: '#all',
        title: 'Welcome',
        content: 'Welcome to Otta.<br/><br/>It\'s time to take control of your content. Otta is here to help you every step of the way from creating the content to analysing the result.',
        placement: 'bottom',
        orphan: true
      },
      {
        element: '#tour_Agenda',
        title: 'Your agenda for the day',
        content: 'See what you need to deal with today. This is a <strong>Demo idea</strong> for the moment.',
        placement: 'left',
        backdrop: true,
        backdropContainer: '#wrapper'
      },
      {
        element: '#help_button',
        title: 'Get help anywhere',
        content: 'You can get help on every page by clicking this help button',
        placement: 'auto',
        backdrop: true,
        backdropContainer: '#wrapper'
      },
      {
        element: '#logout_button',
        title: 'Logout',
        content: 'When you are finished you can just close your window, or use the logout button to log out of the system entirely',
        placement: 'auto',
        backdrop: true,
        backdropContainer: '#wrapper'
      },
      {
        element: '#search_bar',
        title: 'Search',
        content: '<strong>Not implemented yet</strong> but will eventually allow you to search all of your projects for content items, events, pitches, etc',
        placement: 'bottom',
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
