import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MixpanelService, MixpanelEvent } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'services/auth.service';

@Component({
    moduleId: module.id,
    selector: 'content-home-layout',
    templateUrl: 'content-home-layout.component.html',
    styleUrls: ['content-home-layout.component.scss']
})
export class ContentHomeLayoutComponent implements OnInit{
    constructor(private tracking:MixpanelService, private toast: ToastsManager, private userService: AuthService) {
    }

    ngOnInit(): void {
        this.tracking.Track(MixpanelEvent.ContentHome);
    }
}
