import { Component, OnInit } from '@angular/core';
import { ContentProjectModel, ContentProjectService } from 'services/content-project.service';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'content-create-layout',
    templateUrl: 'content-create-layout.component.html',
    styleUrls: ['content-create-layout.component.scss']
})
export class ContentCreateLayoutComponent implements OnInit {

    dataItem: ContentProjectModel = new ContentProjectModel();
    isCreating = false;

    constructor(private tracking: MixpanelService, private router: Router, private contentProjectService: ContentProjectService) {}

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.ContentCreateProject);
    }

    create() {
        console.log('Create project');
        this.isCreating = true;
        this.contentProjectService.createProject(this.dataItem).subscribe(
            response => {
                console.log('Project created', response);
                this.router.navigateByUrl('/content');
            },
            error => this.tracking.TrackError('Error creating content project for user', error),
            () => this.isCreating = false
        );
    }

    cancel() {
        console.log('Cancel');
        this.router.navigateByUrl('/content');
    }

}
