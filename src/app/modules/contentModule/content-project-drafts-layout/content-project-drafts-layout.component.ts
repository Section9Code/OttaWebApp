import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
    moduleId: module.id,
    selector: 'content-project-drafts-layout',
    templateUrl: 'content-project-drafts-layout.component.html',
    styleUrls: ['content-project-drafts-layout.component.scss']
})
export class ContentProjectDraftsLayoutComponent implements OnInit {

    constructor(private tracking: MixpanelService, private toast: ToastsManager) {
    }

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.Content_Draft_View);
    }

    AddDraft(){
        console.log('Add a draft');
    }
}
