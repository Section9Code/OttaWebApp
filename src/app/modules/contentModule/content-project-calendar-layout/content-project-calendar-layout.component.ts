import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'content-project-calendar-layout',
    templateUrl: 'content-project-calendar-layout.component.html',
    styleUrls: ['content-project-calendar-layout.component.scss']
})
export class ContentProjectCalendarLayoutComponent {
    showRequeues = true;
    showContent = true;
    showEvents = true;
}
