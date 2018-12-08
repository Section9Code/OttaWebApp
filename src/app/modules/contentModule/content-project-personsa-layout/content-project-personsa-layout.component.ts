import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectPersona, ProjectPersonaService } from '../services/project-persona.service';
import { ContentProjectShareService } from '../services/ContentProjectShareService';

@Component({
  selector: 'app-content-project-personsa-layout',
  templateUrl: './content-project-personsa-layout.component.html',
  styleUrls: ['./content-project-personsa-layout.component.css']
})
export class ContentProjectPersonsaLayoutComponent implements OnInit {
  personas: ProjectPersona[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personaService: ProjectPersonaService,
    private sharedService: ContentProjectShareService
  ) { }

  ngOnInit() {
    this.personaService.getAll(this.sharedService.currentProject.getValue().id).toPromise().then(response => this.personas = response);
  }

  createPersona() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

}
