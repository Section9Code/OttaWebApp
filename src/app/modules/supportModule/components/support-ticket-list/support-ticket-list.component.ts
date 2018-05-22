import { Component, OnInit } from '@angular/core';
import { UserService, UserSupportTicketModel } from 'services/user.service';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelEvent, MixpanelService } from 'services/mixpanel.service';

@Component({
  selector: 'app-support-ticket-list',
  templateUrl: './support-ticket-list.component.html',
  styleUrls: ['./support-ticket-list.component.css']
})
export class SupportTicketListComponent implements OnInit {
  isLoading = false;
  tickets: UserSupportTicketModel[] = [];

  constructor(
    private userService: UserService,
    private toast: ToastsManager,
    private tracking: MixpanelService
  ) { }

  ngOnInit() {
    // Load the users tickets
    this.isLoading = true;
    this.userService.getAllSupportTickets().toPromise()
    .then(response => {
      console.log('Loaded users tickets', response);
      this.tickets = response;
      this.isLoading = false;
    })
    .catch(error => {
      console.log('Error loading users tickets', error);
      this.tracking.TrackError('Error loading users support tickets', error);
      this.isLoading = false;
    });
  }

}
