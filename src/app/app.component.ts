import { Component, ViewContainerRef } from '@angular/core';
import { AuthService } from "services/auth.service";
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthService, private toast: ToastsManager, private vcr: ViewContainerRef) {
    this.auth.handleAuthentication();
    this.toast.setRootViewContainerRef(vcr);
  }

}
