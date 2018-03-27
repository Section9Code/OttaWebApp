import { Component, Input, OnDestroy, OnInit, group } from '@angular/core';
import { ContentProjectModel } from 'services/content-project.service';
import { EventService, EventGroupModel, EventGroupDatesModel, EventDateModel } from 'services/event.service';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { MixpanelService } from 'services/mixpanel.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { IMyDpOptions } from 'mydatepicker';

declare var $: any;

// <content-project-events [project]="" ></content-project-events>

@Component({
  selector: 'content-project-events',
  templateUrl: './content-events.component.html',
  styleUrls: ['./content-events.component.css']
})
export class ContentEventsComponent implements OnInit, OnDestroy {
  // Inputs
  @Input() project: ContentProjectModel = null;

  // Variables
  isLoadingProjectGroups = false;
  eventGroups: EventGroupDatesModel[] = [];
  eventGroupsSub: Subscription;
  addGroupName = '';

  addGroupFormData: EventGroupModel = new EventGroupModel();
  addDateFormData: EventDateModel = new EventDateModel();

  // Options for the date picker
  datePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd mmm yyyy',
  };

  constructor(
    private eventService: EventService,
    private toast: ToastsManager,
    private tracking: MixpanelService,
    private alertSvc: SweetAlertService) {
  }

  ngOnInit(): void {
    // Load the projects event groups
    this.isLoadingProjectGroups = true;
    this.eventGroupsSub = this.eventService.getAllProjectEventGroups(this.project.id).subscribe(
      response => {
        this.isLoadingProjectGroups = false;
        console.log('Loaded event groups', response);
        this.eventGroups = response;
      },
      error => {
        this.isLoadingProjectGroups = false;
        console.log('Error loading event groups');
        this.toast.error('Error loading event groups');
        this.tracking.TrackError('Error loading event groups for project', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.eventGroupsSub) this.eventGroupsSub.unsubscribe();
  }

  // Methods ---------------------------------
  addGroup(modalId: string) {
    console.log('Add group', modalId);

    // Make sure the colour is set
    if (this.addGroupFormData.ColourHex === '') {
      this.addGroupFormData.ColourHex = '#cccccc';
    }

    // Is this an add or an update
    if (this.addGroupFormData.id) {
      this.updateGroup();
      return;
    }

    // Validate
    if (!this.addGroupFormData.Name || !this.addGroupFormData.Description) {
      console.log('Not valid');
      return;
    }

    // Update the group data
    this.addGroupFormData.ProjectId = this.project.id;

    // Create the event group
    this.eventService.addEventGroup(this.project.id, this.addGroupFormData).toPromise()
      .then(response => {
        console.log('Group added', response);

        // Show the new event group to the user
        const eventGroupDates = new EventGroupDatesModel();
        eventGroupDates.Group = response;
        eventGroupDates.Dates = [];
        this.eventGroups.push(eventGroupDates);

        // Clean the form
        this.addGroupFormData = new EventGroupModel();

        // Tell the user
        this.toast.success('Added new event group to your project', 'Added event group');

        // Hide the modal dialog
        $(`#${modalId}`).modal('hide');
      })
      .catch(error => {
        console.log('Error occurred adding group', error);
        this.toast.error('Unable to add your event group to the project');
      });
  }

  showAddGroup() {
    this.addGroupFormData = new EventGroupModel();
    $('#addGroupModal').modal('show');
  }

  showUpdateGroup(groupId) {
    const index = this.eventGroups.findIndex(g => g.Group.id === groupId);
    this.addGroupFormData = this.eventGroups[index].Group;
    $('#addGroupModal').modal('show');
  }

  updateGroup() {
    console.log('Update group', this.addGroupFormData);

    this.eventService.updateEventGroup(this.project.id, this.addGroupFormData).toPromise()
      .then(response => {
        // Update the event group
        const index = this.eventGroups.findIndex(g => g.Group.id === this.addGroupFormData.id);
        this.eventGroups[index].Group = response;

        // Tell the user
        this.toast.success('Event group updated','Updated');
        $('#addGroupModal').modal('hide');
      })
      .catch(() => {
        this.toast.error('Unable to update group');
      });
  }

  deleteGroup(groupId: string) {
    console.log('Delete group', groupId);
    this.alertSvc.swal({
      title: 'Remove group',
      text: 'Are you sure you want to remove this group?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      this.eventService.removeEventGroup(this.project.id, groupId).toPromise()
        .then(response => {
          // Remove the group from the list
          const index = this.eventGroups.findIndex(e => e.Group.id === groupId);
          this.eventGroups.splice(index, 1);
          this.toast.success('The event group has been removed');
        })
        .catch(error => {
          this.toast.error('Unable to remove event group');
        });
    },
      error => {
        // Error
        console.log('Error');
      },
      () => {
        // Complete
      }
    );
  }

  showAddDateModal(groupId: string) {
    this.addDateFormData.Title = '';
    this.addDateFormData.Description = '';
    this.addDateFormData.ParentEventGroupId = groupId;
    this.addDateFormData.StartDate = null;

    $(`#addDateModal`).modal('show');
  }

  addDate() {
    console.log('Add Date', this.addDateFormData);

    // Validate
    if (!this.addDateFormData.Title || !this.addDateFormData.Description || !this.addDateFormData.StartDate) {
      // Not all the form data has been supplied
      return;
    }

    // Fix the format of the start date
    const selectedDate: any = this.addDateFormData.StartDate;
    this.addDateFormData.StartDate = new Date(selectedDate.date.year, selectedDate.date.month - 1, selectedDate.date.day, 0, 0, 0, 0);

    this.eventService.addPrivateDate(this.project.id, this.addDateFormData).toPromise()
      .then(response => {
        console.log('Date added');

        // Update the list of dates
        const groupIndex = this.eventGroups.findIndex(f => f.Group.id === this.addDateFormData.ParentEventGroupId);
        this.eventGroups[groupIndex].Dates.push(response);

        // Clear the form
        this.addDateFormData = new EventDateModel();

        // Tell the user
        this.toast.success('Date has been added', 'Date added');
        $(`#addDateModal`).modal('hide');
      })
      .catch(error => {
        this.toast.error('Unable to add date to group', 'Error');
        this.tracking.TrackError('Error occurred adding date to group', error);
      });
  }

  removeDate(groupId: string, dateId: string) {
    console.log(`Remove date ${groupId}>${dateId}`);

    this.alertSvc.swal({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this date?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      console.log('Confirmed');
      this.eventService.removePrivateDate(this.project.id, groupId, dateId).toPromise()
        .then(response => {
          // Remove the date from the list
          const groupIndex = this.eventGroups.findIndex(f => f.Group.id === groupId);
          const dateIndex = this.eventGroups[groupIndex].Dates.findIndex(d => d.id === dateId);
          this.eventGroups[groupIndex].Dates.splice(dateIndex, 1);

          // Tell the user
          this.toast.success('The date has been removed', 'Date removed');
        })
        .catch(error => {
          this.toast.error('Unable to delete date from group', 'Error');
          this.tracking.TrackError('Error occurred deleting date from group', error);
        });
    },
      () => {
        // Error
        console.log('Alert dismissed');
      },
      () => {
        // Complete
      }
    );



  }

}
