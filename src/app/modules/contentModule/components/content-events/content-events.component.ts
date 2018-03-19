import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  eventGroups: EventGroupDatesModel[] = [];
  eventGroupsSub: Subscription;
  addGroupName = '';
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
    this.eventGroupsSub = this.eventService.getAllProjectEventGroups(this.project.id).subscribe(
      response => {
        console.log('Loaded event groups', response);
        this.eventGroups = response;
      },
      error => {
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
  addGroup(modalId: string, groupName: string, groupDescription: string) {
    console.log('Add group', modalId);

    // Create a new event group
    const group = new EventGroupModel();
    group.Name = groupName;
    group.Description = groupDescription;
    group.ProjectId = this.project.id;

    // Create the event group
    this.eventService.addEventGroup(this.project.id, group).toPromise()
      .then(response => {
        // Create a new event group
        const eventGroupDates = new EventGroupDatesModel();
        eventGroupDates.Group = response;
        eventGroupDates.Dates = [];
        this.eventGroups.push(eventGroupDates);
        this.toast.success('Added new event group to your project', 'Added event group');
      })
      .catch(error => {
        console.log('Error occurred adding group', error);
        this.toast.error('Unable to add your event group to the project');
      });

    // Hide the modal dialog
    $(`#${modalId}`).modal('hide');
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

    // Fix the format of the start date
    const selectedDate: any = this.addDateFormData.StartDate;
    this.addDateFormData.StartDate = new Date(selectedDate.date.year, selectedDate.date.month - 1, selectedDate.date.day, 0, 0, 0, 0);

    this.eventService.addPrivateDate(this.project.id, this.addDateFormData).toPromise()
      .then(() => {
        console.log('Date added');
        const groupIndex = this.eventGroups.findIndex(f => f.Group.id === this.addDateFormData.ParentEventGroupId);
        this.eventGroups[groupIndex].Dates.push(this.addDateFormData);
        this.toast.success('Date has been added', 'Date added');
      })
      .catch(error => {
        this.toast.error('Unable to add date to group', 'Error');
        this.tracking.TrackError('Error occurred adding date to group', error);
      });

    // Hide the modal dialog
    $(`#addDateModal`).modal('hide');
  }
}
