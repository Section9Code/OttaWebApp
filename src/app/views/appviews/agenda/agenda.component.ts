import { Component, OnInit } from '@angular/core';
import { AgendaService, AgendaModel } from 'services/agenda.service';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  agenda: AgendaModel = new AgendaModel();
  isLoading = false;

  constructor(
    private agendaService: AgendaService,
    private tracking: MixpanelService,
    private toast: ToastsManager
  ) { }

  ngOnInit() {
    // Load the users agenda
    this.isLoading = true;
    this.agendaService.getAgenda().toPromise()
    .then(response => {
      console.log('Loaded agenda', response);
      this.agenda = response;
      this.isLoading = false;
    })
    .catch(error => {
      console.log('Error loading users agenda', error);
      this.tracking.TrackError('Error loading users agenda', error);
      this.toast.error('Unable to load your agenda','Agenda error');
      this.isLoading = false;
    });
  }

}
