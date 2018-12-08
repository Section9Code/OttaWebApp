import { Component, OnInit } from '@angular/core';
import { ProjectPersona, ProjectPersonaService } from '../services/project-persona.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ContentProjectShareService } from '../services/ContentProjectShareService';

@Component({
  selector: 'app-content-project-personsa-edit-layout',
  templateUrl: './content-project-personsa-edit-layout.component.html',
  styleUrls: ['./content-project-personsa-edit-layout.component.css']
})
export class ContentProjectPersonsaEditLayoutComponent implements OnInit {

  persona = new ProjectPersona();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personaService: ProjectPersonaService,
    private sharedService: ContentProjectShareService,
    private alertSvc: SweetAlertService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.personaService.getSingle(this.sharedService.currentProject.getValue().id, id).toPromise().then(response => this.persona = response);
    });
  }

  async update() {
    await this.personaService.update(this.sharedService.currentProject.getValue().id, this.persona).toPromise();
    this.goToList();
  }

  delete() {
    this.alertSvc.swal({
      title: 'Delete persona',
      text: "Are you sure you want to delete this persona?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async () => {
      // Delete
      await this.personaService.delete(this.sharedService.currentProject.getValue().id, this.persona.id).toPromise();
      this.goToList();
    },
      error => { }
    );
  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
