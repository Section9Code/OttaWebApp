import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ContentItemMessageSubstitution } from 'services/content-item.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SweetAlertService } from 'ng2-sweetalert2';

declare var $: any;

// Example useage
// <app-cim-substitutions-list [substitutions]="listOfSubs" (onSubstitutionAdded)="callWhenAdded"></app-cim-substitutions-list>

@Component({
  selector: 'app-cim-substitutions-list',
  templateUrl: './cim-substitutions-list.component.html',
  styleUrls: ['./cim-substitutions-list.component.css']
})
export class CimSubstitutionsListComponent implements OnInit {
  // The list of substitutions for this list
  @Input() substitutions: ContentItemMessageSubstitution[] = [];
  // Output events
  @Output() onSubstitutionAdded = new EventEmitter<ContentItemMessageSubstitution>();
  @Output() onSubstitutionValueUpdated = new EventEmitter<ContentItemMessageSubstitution>();
  @Output() onSubstitutionRemove = new EventEmitter<ContentItemMessageSubstitution>();

  subForm: FormGroup;
  formIsEdit = false;

  constructor(
    private alertSvc: SweetAlertService
  ) {
    this.subForm = new FormGroup({
      name: new FormControl('', Validators.required),
      val: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  showAddForm() {
    this.subForm.reset();
    this.formIsEdit = false;
    $(`#addSubstitutionModal`).modal('show');
  }

  addSubstitution() {
    if (this.subForm.valid) {
      // A new substitution has been added
      this.onSubstitutionAdded.emit(new ContentItemMessageSubstitution(this.subForm.controls.name.value, this.subForm.controls.val.value));
      $(`#addSubstitutionModal`).modal('hide');
    }
  }

  cancel() {
    $(`#addSubstitutionModal`).modal('hide');
  }

  editSub(sub: ContentItemMessageSubstitution) {
    this.subForm.reset();
    this.formIsEdit = true;
    this.subForm.controls.name.patchValue(sub.name);
    this.subForm.controls.val.patchValue(sub.value);
    $(`#addSubstitutionModal`).modal('show');
  }

  updateSubstitution() {
    $(`#addSubstitutionModal`).modal('hide');
    const sub = this.substitutions.find(s => s.name === this.subForm.controls.name.value);
    sub.value = this.subForm.controls.val.value;
    this.onSubstitutionValueUpdated.emit(sub);
  }

  removeSub(subName: string) {
    $(`#addSubstitutionModal`).modal('hide');
    const sub = this.substitutions.find(s => s.name === subName);

    this.alertSvc.swal({
      title: `Remove substitution ${sub.name}`,
      text: "Are you sure you want to remove this substitution, any massages using it might not work correctly",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      console.log('Confirmed');
      this.onSubstitutionRemove.emit(sub);
    },
      error => {
        // Error
        console.log('Alert dismissed');
      },
      () => {
        // Complete
      }
    );
  }

}
