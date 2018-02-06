import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {  } from 'events';

// Example
//
// <otta-panel [title]="aaa" subtitle="" subtitlePullRight=false footer="" footerRight="" showButton="false" buttonText="" (buttonClicked)=""></otta-panel>
//

@Component({
    moduleId: module.id,
    selector: 'otta-panel',
    templateUrl: 'otta-panel.component.html'
})
export class OttaPanelComponent {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() subtitlePullRight = false;
    @Input() footer: string;
    @Input() footerRight: string;
    @Input() showButton = false;
    @Input() buttonText = '';
    @Output() buttonClicked = new EventEmitter();

    panelButtonClicked(){
        this.buttonClicked.emit();
    }
}
