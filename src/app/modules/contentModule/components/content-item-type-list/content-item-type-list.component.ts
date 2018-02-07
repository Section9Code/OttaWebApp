import { Component, OnInit, transition } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { MixpanelService } from 'services/mixpanel.service';
import { ContentProjectShareService } from 'app/modules/contentModule/services/ContentProjectShareService';
import { ContentItemTypeService, ContentItemTypeModel } from 'services/content-item-type.service';

@Component({
    moduleId: module.id,
    selector: 'content-item-type-list',
    templateUrl: 'content-item-type-list.component.html',
    styleUrls: ['content-item-type-list.component.scss']
})
export class ContentItemTypeListComponent implements OnInit {
    types: ContentItemTypeModel[] = [];
    isLoading = false;

    createItem: ContentItemTypeModel = new ContentItemTypeModel();
    isCreating = false;

    constructor(private router: Router, private route: ActivatedRoute, private toast: ToastsManager, private tracking: MixpanelService,
        private sharedData: ContentProjectShareService, private typeService: ContentItemTypeService) {
    }

    ngOnInit(): void {
        this.loadTypes();
    }

    loadTypes() {
        // Load all the types
        this.typeService.getTypes(this.sharedData.currentProject.getValue().id).subscribe(
            response => this.types = response,
            error => {
                this.toast.error('Unable to load types');
                this.tracking.TrackError('Unable to load content item types', error);
            },
            () => this.isLoading = false
        );
    }

    createType(newType: ContentItemTypeModel) {
        // Create the type
        console.log('Create type', newType);
        var projectId = this.sharedData.currentProject.getValue().id;
        this.typeService.createType(projectId, this.createItem).subscribe(
            response => {
                this.toast.success('Type added to project');
                this.createItem = new ContentItemTypeModel();
                this.loadTypes();
            },
            error => {
                this.toast.error('Error occurred adding type to project');
                this.tracking.TrackError('Error occurred adding type to project', error);
            },
            () => this.isCreating = false
        );
    }

}
