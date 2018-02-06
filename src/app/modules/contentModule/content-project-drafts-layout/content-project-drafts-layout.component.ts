import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-layout',
    templateUrl: 'content-project-drafts-layout.component.html',
    styleUrls: ['content-project-drafts-layout.component.scss']
})
export class ContentProjectDraftsLayoutComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    AddDraft(){
        console.log('Add a draft');
    }
}
