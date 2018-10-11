import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';
import { AuthService } from 'services/auth.service';
import { environment } from 'environments/environment';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit, OnChanges {
  @Input() images: string[] = [];         // Array of image URLs
  @Input() section: string = 'unknown';   // The section of the organisations file space to use
  @Input() id: string = 'unknown';        // The ID of the page this is using
  @Output() onImageUploaded = new EventEmitter<string>();
  @Output() onImageDeleted = new EventEmitter<string>();

  // Flags
  isLoadingImages = false;            // True when data is being loaded

  // Configuration for the dropzone component on the page
  dropzoneConfig: any = {
    url: ``,
    method: 'post',
    headers: {},
    maxFilesize: 5,
    acceptedFiles: 'image/*'
  };

  @ViewChild('dropzoneComponent') dropzoneComponent: DropzoneComponent;

  constructor(
    private auth: AuthService,
    private toast: ToastsManager,
  ) {
    const token = auth.getAccessToken();
    this.dropzoneConfig.headers = { 'Authorization': `Bearer ${token}` };
  }

  ngOnInit() {
    // Set the access token so the dropzone component can make calls to the API    
    this.setUploadPath();
  }

  setUploadPath() {
    this.dropzoneConfig.url = `${environment.baseApiUrl}/api/images?folderName=${this.section}/${this.id}&width=-1`;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Image component - Changes', changes);

    // ID
    if (changes.id && changes.id.currentValue !== changes.id.previousValue) {
      console.log('Image component - Changes - ID');
      this.id = changes.id.currentValue;
      this.setUploadPath();
    }

    // Section
    if (changes.section && changes.section.currentValue !== changes.section.previousValue) {
      console.log('Image component - Changes - Section');
      this.section = changes.section.currentValue;
      this.setUploadPath();
    }

    // Images
    if (changes.images && changes.images.currentValue !== changes.images.previousValue) {
      console.log('Image component - Changes - images');
      this.images = changes.images.currentValue;
    }
    
  }

  // Error during image upload
  onUploadError(event) {
    console.log('Upload error', event);
    this.toast.error('An error occurred while uploading an image', 'Error');
  }

  // An image has been uploaded
  onUploadSuccess(event) {
    console.log('Upload success', event);
    const imageSrc = event[1];
    //this.images.push(imageSrc);
    this.onImageUploaded.emit(imageSrc);
  }

  // The download queue is complete
  onQueueComplete(event) {
    this.dropzoneComponent.directiveRef.reset();
  }

  // The user wants to delete an image
  delete(imageUrl: string) {
    this.onImageDeleted.emit(imageUrl);
  }
}
