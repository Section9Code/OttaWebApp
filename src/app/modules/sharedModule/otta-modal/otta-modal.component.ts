import { Component, Input, Output, EventEmitter } from '@angular/core';

// This is based off the Bootstrap modal JS code. - https://v4-alpha.getbootstrap.com/components/modal/#via-javascript

// declare var $:any;
// You can use $(`#modalId`).modal('hide'); to dismiss a modal from angular.

// <otta-modal [modalId]="'ModalID'" [title]="'Title'" [icon]="'fa-laptop'" [heading]="'Heading text'" [showFooter]="false" [footerButtonText]="'Save'" (footerButtonClicked)="" >
//    Put content here
// </otta-modal>

@Component({
  selector: 'otta-modal',
  templateUrl: './otta-modal.component.html',
  styleUrls: ['./otta-modal.component.css']
})
export class OttaModalComponent {
  // Inputs
  @Input() modalId: string;
  @Input() title = 'This is the title';
  @Input() icon = 'fa-laptop';
  @Input() heading = 'Heading text';
  @Input() showFooter = false;
  @Input() footerButtonText = 'Save';

  // Outputs
  @Output() footerButtonClicked = new EventEmitter();

  // Methods
  footerClick() {
    this.footerButtonClicked.emit();
  }
}
