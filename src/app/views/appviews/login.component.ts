import { Component, OnInit } from '@angular/core';
import { AuthService } from "services/auth.service";
import { Router } from "@angular/router";
import { MixpanelService, MixpanelEvent } from "services/mixpanel.service";
import { environment } from 'environments/environment';

@Component({
  selector: 'login',
  templateUrl: 'login.template.html'
})
export class LoginComponent implements OnInit { 
  version: string = environment.version;

  constructor(private auth: AuthService, private router:Router, private mixpanel:MixpanelService) { }

  ngOnInit(): void {
    this.mixpanel.Track(MixpanelEvent.Login);
    if(this.auth.isAuthenticated())
    {
      this.router.navigate(['/']);
    }
  }
}
