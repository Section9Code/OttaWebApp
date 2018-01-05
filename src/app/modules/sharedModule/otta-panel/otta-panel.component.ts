import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

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
}
