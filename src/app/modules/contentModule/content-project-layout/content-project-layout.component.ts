import { Component, OnInit } from '@angular/core';
import { ContentProjectModel, ContentProjectService } from 'services/content-project.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { SweetAlertService } from 'ng2-sweetalert2';
import { UserDataService } from 'services/user-data.service';

@Component({
    moduleId: module.id,
    selector: 'content-project-layout',
    templateUrl: 'content-project-layout.component.html',
    styleUrls: ['content-project-layout.component.scss']
})
export class ContentProjectLayoutComponent implements OnInit {
    isAdmin = false;
    isLoading = false;
    projectId: string;
    project: ContentProjectModel = new ContentProjectModel();

    constructor(private tracking: MixpanelService, private toast: ToastsManager, private route: ActivatedRoute, private router: Router,
        private projectService: ContentProjectService, private userDataService: UserDataService, private alertSvc: SweetAlertService) {
    }

    ngOnInit(): void {
        this.isAdmin = this.userDataService.userIsOrgAdmin;

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

    closeProject() {
        this.tracking.Track(MixpanelEvent.Content_Remove_Project, this.projectId);
        // Ask the user if they are sure they want to remove the suggestion
        this.alertSvc.swal({
            title: 'Are you sure?',
            text: "Once removed you will not be able to recover the project",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then(() => {
            // Confirmed
            console.log('Confirmed');
            this.projectService.removeProject(this.projectId).subscribe(
                response => {
                    this.toast.success('The project has been removed');
                    this.userDataService.removeProject(this.projectId)
                    this.router.navigateByUrl('/content');
                },
                error => {
                    this.toast.error('An error occurred while trying to remove project', 'Unable to remove project');
                    this.tracking.TrackError(`Unable to remove project ${this.projectId}`, error);
                }
            );

        },
            error => { },
            () => { }
        );



    }
}
