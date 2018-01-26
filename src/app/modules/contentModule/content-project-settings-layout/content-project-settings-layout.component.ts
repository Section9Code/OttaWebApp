import { Component, OnInit } from '@angular/core';
import { MixpanelEvent, MixpanelService } from 'services/mixpanel.service';
import { ContentProjectModel, ContentProjectService } from 'services/content-project.service';
import { ToastsManager } from 'ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from 'services/user-data.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';

@Component({
    moduleId: module.id,
    selector: 'content-project-settings-layout',
    templateUrl: 'content-project-settings-layout.component.html',
    styleUrls: ['content-project-settings-layout.component.scss']
})
export class ContentProjectSettingsLayoutComponent implements OnInit {
    project: ContentProjectModel = new ContentProjectModel();


    constructor(private tracking: MixpanelService, private toast: ToastsManager, private route: ActivatedRoute, private router: Router,
        private projectService: ContentProjectService, private userDataService: UserDataService,
        private sharedService: ContentProjectShareService, private alertSvc: SweetAlertService) {
    }

    ngOnInit(): void {
        // Subscribe to the current project
        this.sharedService.currentProject.subscribe(response => this.project = response);
    }

    closeProject() {
        this.tracking.Track(MixpanelEvent.Content_Remove_Project, this.project.id);
        // Ask the user if they are sure they want to remove the suggestion
        this.alertSvc.swal({
            title: 'Are you sure?',
            text: 'Once removed you will not be able to recover the project',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then(() => {
            // Confirmed
            console.log('Confirmed');
            this.projectService.removeProject(this.project.id).subscribe(
                response => {
                    this.toast.success('The project has been removed');
                    this.userDataService.removeProject(this.project.id)
                    this.router.navigateByUrl('/content');
                },
                error => {
                    this.toast.error('An error occurred while trying to remove project', 'Unable to remove project');
                    this.tracking.TrackError(`Unable to remove project ${this.project.id}`, error);
                }
            );

        },
            error => { },
            () => { }
        );



    }
}
