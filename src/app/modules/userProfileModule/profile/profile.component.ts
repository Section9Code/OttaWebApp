import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastsManager } from 'ng2-toastr';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { UserService, UserSettings } from 'services/user.service';
import { UserDataService } from 'services/user-data.service';
import { Observable } from 'rxjs/Observable';
@Component({
    moduleId: module.id,
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit {
    dataItem: UserSettings = new UserSettings;
    isLoading = false;
    isUpdating = false;
    isUpdatingUserSettings = false;
    isUpdatingMarketing = false;

    constructor(private userService: UserService, private toast: ToastsManager,private tracking: MixpanelService,
        private userDataService: UserDataService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.tracking.Track(MixpanelEvent.UserProfile_View);

        // Load the users information
        this.userService.getSettings().subscribe(
            response => {
                console.log('Loaded users settings', response);
                this.dataItem = response;
                this.isLoading = false;
            },
            error => {
                this.tracking.TrackError('Unable to load user settings', error);
                this.toast.error('Unable to load user settings', 'Error');
            },
            () => this.isLoading = false
        );
    }

    // Save changes to the user settings
    saveChanges(cb) {
        this.userService.updateSettings(this.dataItem).subscribe(
            response => {
                // Update the shared application state
                this.userDataService.showCreatorOptionsSubject.next(this.dataItem.ShowCreatorOptions);
                this.userDataService.showOrganisationOptionsSubject.next(this.dataItem.ShowOrganisationOptions);
                // Update the IU
                this.tracking.Track(MixpanelEvent.UserProfile_Update);
                this.toast.success('Preferences updated', 'Update');
            },
            error => {
                console.log('Error updating user settings', error);
                this.tracking.TrackError('Error occurred while updating the users settings', error);
                this.toast.error('Unable to update settings', 'Error while saving');
            },
            () => cb()
        );
    }

    updateUser() {
        console.log('Update user', this.dataItem);
        this.isUpdating = true;
        this.saveChanges(() => this.isUpdating = false);
    }

    updateSettings() {
        console.log('Update settings', this.dataItem);
        this.isUpdatingUserSettings = true;
        this.saveChanges(() => this.isUpdatingUserSettings = false);
    }

    updateMarketing() {
        console.log('Update marketing settings', this.dataItem);
        this.isUpdatingMarketing = true;
        this.saveChanges(() => this.isUpdatingMarketing = false);
    }
}
