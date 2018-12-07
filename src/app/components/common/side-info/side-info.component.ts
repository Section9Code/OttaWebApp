import { Component, OnInit } from '@angular/core';
import { SideInfoService } from 'services/side-info.service';
import { Router } from '@angular/router';
import { TourService } from 'services/tour.service';

@Component({
  selector: 'app-side-info',
  templateUrl: './side-info.component.html',
  styleUrls: ['./side-info.component.css']
})
export class SideInfoComponent implements OnInit {
  message: string;

  constructor(
    private router: Router,
    private sideInfoService: SideInfoService,
    private tourService: TourService
  ) { }

  async ngOnInit() {
    // Get the content for the side menu
    const url = this.tourService.processUrl(this.router.url);
    this.sideInfoService.GetSideInfo(url).toPromise()
    .then(msg => this.message = msg)
    .catch(() => this.message = '');
  }



}
