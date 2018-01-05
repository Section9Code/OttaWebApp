import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'loadingSpinner',
    templateUrl: 'loading-spinner.component.html',
    styleUrls: ['loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
    @Input() loading: boolean;
}
