import { Component, OnInit } from '@angular/core';
import { ContentProjectModel, ContentProjectService } from 'services/content-project.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    moduleId: module.id,
    selector: 'content-project-layout',
    templateUrl: 'content-project-layout.component.html',
    styleUrls: ['content-project-layout.component.scss']
})
export class ContentProjectLayoutComponent implements OnInit {
    isLoading = false;
    projectId: string;
    project: ContentProjectModel = new ContentProjectModel();

    // tslint:disable-next-line:max-line-length
    constructor(private tracking: MixpanelService, private toast: ToastsManager, private route: ActivatedRoute, private router: Router, private projectService: ContentProjectService) {
    }

    ngOnInit(): void {
        // Load the project
        this.isLoading = true;
        this.route.params.subscribe(
            params => {
                this.projectId = params['id'];

                // Load the project
                this.projectService.getProject(this.projectId).subscribe(
                    response => {
                        console.log('Project loaded', response);
                        this.project = response;
                    },
                    error => {
                        console.log('Error loading project', error);
                        this.tracking.TrackError('Unable to load project', this.projectId);
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
            },
            error => console.log('Params error')
        );
    }
}
