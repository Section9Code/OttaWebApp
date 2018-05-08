import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ContentItemModel } from 'services/content-item.service';
import { ImagesService } from 'services/images.service';
import { Subscription } from 'rxjs/Subscription';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'otta-content-item-files',
  templateUrl: './content-item-files.component.html',
  styleUrls: ['./content-item-files.component.css']
})
export class ContentItemFilesComponent implements OnInit, OnDestroy {
  // Variables
  @Input() data: ContentItemModel = new ContentItemModel();
  files: string[] = [];
  fileSub: Subscription;

  // Flags
  isLoading = false;

  constructor(
    private fileStore: ImagesService,
    private tracking: MixpanelService,
    private toast: ToastsManager
  ) { }

  ngOnInit() {
    // Load all the images for this content item
    this.isLoading = true;
    this.fileSub = this.fileStore.getAllFilesInFolder(`contentItems/${this.data.id}`).subscribe(
      response => {
        console.log('Loaded files', response);
        this.files = response;
        this.isLoading = false;
      },
      error => {
        console.log('Error loading files', error);
        this.tracking.TrackError(`Error loading files for content item ${this.data.id}`, error);
        this.toast.error('Unable to load files for this content items', 'Unable to load files');
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.fileSub) { this.fileSub.unsubscribe(); }
  }
}
