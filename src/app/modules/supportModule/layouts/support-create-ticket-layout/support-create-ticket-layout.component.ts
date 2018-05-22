import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastModule, ToastsManager } from 'ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserSupportTicketModel } from 'services/user.service';
import { MixpanelEvent, MixpanelService } from 'services/mixpanel.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-support-create-ticket-layout',
  templateUrl: './support-create-ticket-layout.component.html',
  styleUrls: ['./support-create-ticket-layout.component.css']
})
export class SupportCreateTicketLayoutComponent implements OnInit {
  ticketForm: FormGroup;
  isCreating = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastsManager,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private tracking: MixpanelService
  ) {
    // Setup the ticket form
    this.ticketForm = fb.group({
      'subject': [null, Validators.required],
      'message': [null, Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(500)])]
    });
  }

  ngOnInit() {
  }

  addTicket() {
    console.log('Add ticket', this.ticketForm);

    // Store the form if it is valid
    if (this.ticketForm.valid) {
      this.isCreating = true;

      // Create the ticket object
      const ticket = new UserSupportTicketModel();
      ticket.Subject = this.ticketForm.get('subject').value;
      ticket.Message = this.ticketForm.get('message').value;

      // Store
      this.userService.addSupportTicket(ticket).toPromise()
        .then(response => {
          this.toast.success('Support ticket created');
          this.isCreating = false;
          this.navigateBackToList();
        })
        .catch(error => {
          this.tracking.TrackError('Error adding support ticket for user', error);
          this.isCreating = false;
          this.toast.error('Unable to create support ticket. Please try again later', 'Error');
        });
    } else {
      // Form isn't valid
      this.toast.info('Form is not valid. Please update the form and try again');
    }
  }

  cancel() {
    this.navigateBackToList();
  }

  navigateBackToList() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
