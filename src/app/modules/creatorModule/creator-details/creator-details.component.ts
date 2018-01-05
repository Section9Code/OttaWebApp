import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { CreatorService, CreatorModel } from 'services/creator.service';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { environment } from 'environments/environment';
import { OttaPanelComponent } from 'app/modules/sharedModule/otta-panel/otta-panel.component';

@Component({
    moduleId: module.id,
    selector: 'creator-details',
    templateUrl: 'creator-details.component.html'
})
export class CreatorDetailsComponent implements OnInit {
    creator: CreatorModel = new CreatorModel();
    isLoadingCreator = false;
    isUpdatingCreator = false;

    constructor(private creatorService: CreatorService, private tracking: MixpanelService, private toast: ToastsManager) {
    }

    ngOnInit(): void {
        // Load the users creator information
        console.log('Loading creator data');
        this.isLoadingCreator = true;
        this.creatorService.getCreator().subscribe(
            response => {
                this.isLoadingCreator = false;
                console.log('Loaded users creator', response);
                this.creator = response;
            },
            error => {
                this.isLoadingCreator = false;
                console.log('Could not load the users creator, they don\'t have one', error);
            }
        );
    }

    updateCreator() {
        console.log('Update creator');
        this.isUpdatingCreator = true;
        this.creatorService.updateCreator(this.creator).subscribe(
            response => {
                this.isUpdatingCreator = false;
                this.toast.success('Your details have been updated','Updated');
            },
            error => {
                this.isUpdatingCreator = false;
                console.log('Error occurred updating creator', error);
                this.toast.error('Error occurred updating your record', 'Error');
                this.tracking.TrackError('Error occurred updating users creator record', error);
            }
        );
    }

}
