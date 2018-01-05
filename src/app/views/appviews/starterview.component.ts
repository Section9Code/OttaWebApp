import { Component, OnDestroy, OnInit, } from '@angular/core';
import { MixpanelService, MixpanelEvent } from "services/mixpanel.service";

@Component({
  selector: 'starter',
  templateUrl: 'starter.template.html'
})
export class StarterViewComponent implements OnDestroy, OnInit  {

public nav:any;

public constructor(private mixpanel:MixpanelService) {
  this.nav = document.querySelector('nav.navbar');
}

public ngOnInit():any {
  this.mixpanel.Track(MixpanelEvent.Home);
  this.nav.className += " white-bg";
}


public ngOnDestroy():any {
  this.nav.classList.remove("white-bg");
}

}
