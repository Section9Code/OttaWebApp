import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPersonaService, ProjectPersona } from '../services/project-persona.service';
import { ContentProjectShareService } from '../services/ContentProjectShareService';

@Component({
  selector: 'app-content-project-personsa-create-layout',
  templateUrl: './content-project-personsa-create-layout.component.html',
  styleUrls: ['./content-project-personsa-create-layout.component.css']
})
export class ContentProjectPersonsaCreateLayoutComponent implements OnInit {

  persona = new ProjectPersona();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personaService: ProjectPersonaService,
    private sharedService: ContentProjectShareService
  ) { }

  ngOnInit() {
  }

  async create() {
    await this.personaService.create(this.sharedService.currentProject.getValue().id, this.persona).toPromise();
    this.goToList();
  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
