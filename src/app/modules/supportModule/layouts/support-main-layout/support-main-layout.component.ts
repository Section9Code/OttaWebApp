import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-support-main-layout',
  templateUrl: './support-main-layout.component.html',
  styleUrls: ['./support-main-layout.component.css']
})
export class SupportMainLayoutComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  createSupportTicket(){
    this.router.navigate(['create'], {relativeTo: this.activatedRoute});
  }
}
