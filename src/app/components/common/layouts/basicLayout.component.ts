import { Component } from '@angular/core';
import { detectBody } from '../../../app.helpers';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BasicLayoutComponent {
  isLoadingModule = false;

  constructor(private router: Router) { }

  public ngOnInit(): any {
    detectBody();

    // Listen for when the router loads a module and display the loading spinner as needed
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoadingModule = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoadingModule = false;
      }
    });
  }

  public onResize() {
    detectBody();
  }

}
