import { Component, OnInit, OnDestroy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ContentItemModel } from 'services/content-item.service';
import { ImagesService } from 'services/images.service';
import { Subscription } from 'rxjs/Subscription';
import { MixpanelService } from 'services/mixpanel.service';
import { ToastsManager } from 'ng2-toastr';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from 'services/auth.service';
import { SweetAlertService } from 'ng2-sweetalert2';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'otta-content-item-files',
  templateUrl: './content-item-files.component.html',
  styleUrls: ['./content-item-files.component.css']
})
export class ContentItemFilesComponent implements OnInit, OnDestroy {
  // Variables
  @Input() data: ContentItemModel = new ContentItemModel();
  @Output() fileUploaded: EventEmitter<string> = new EventEmitter<string>();
  @Output() fileDeleted: EventEmitter<string> = new EventEmitter<string>();
  files: string[] = [];
  fileSub: Subscription;

  // Flags
  isLoading = false;

  // Dropzone config
  dropzoneConfig: any = {
    url: ``,
    method: 'post',
    headers: {},
    maxFilesize: 5,
    acceptedFiles: 'image/*'
  };

  @ViewChild('dropzoneComponent') dropzoneComponent: DropzoneComponent;

  constructor(
    private fileStore: ImagesService,
    private tracking: MixpanelService,
    private toast: ToastsManager,
    private auth: AuthService,
    private alertSvc: SweetAlertService
  ) {
    // Set the access token so Dropzone can make calls to the API    
    const token = auth.getAccessToken();
    this.dropzoneConfig.headers = { 'Authorization': `Bearer ${token}` };
  }

  ngOnInit() {
    this.reloadImages();
  }

  ngOnDestroy(): void {
    if (this.fileSub) { this.fileSub.unsubscribe(); }
  }

  // Load all the images for this content item
  reloadImages() {
    this.isLoading = true;
    this.fileSub = this.fileStore.getAllFilesInFolder(`contentItem/${this.data.id}`).subscribe(
      response => {
        console.log('Loaded files', response);
        this.files = response;
        this.isLoading = false;
        // Set the destination for the dropzone
        this.dropzoneConfig.url = `${environment.baseApiUrl}/api/images?folderName=contentItem/${this.data.id}&width=-1`;
      },
      error => {
        console.log('Error loading files', error);
        this.tracking.TrackError(`Error loading files for content item ${this.data.id}`, error);
        this.toast.error('Unable to load files for this content items', 'Unable to load files');
        this.isLoading = false;
      }
    );
  }

  onUploadError(event) {
    console.log('Upload error', event);
    this.toast.error('An error occurred while uploading an image', 'Error');
    this.reloadImages();
  }

  onUploadSuccess(event) {
    console.log('Upload success', event);
    const imageSrc = event[1];
    this.files.push(imageSrc);
    this.fileUploaded.emit(imageSrc);
  }

  onQueueComplete(event) {
    this.dropzoneComponent.directiveRef.reset();
  }

  // Searches the social media messages for an image
  checkMessagesForImage(path: string): boolean {
    // tslint:disable-next-line:triple-equals
    if (!this.data.SocialMediaMessages) {
      // There are no social media messages, so image can't be being used.
      return false;
    }

    // Search the social media messages for the item
    const items = this.data.SocialMediaMessages.filter(m => m.ImageUrl == path);
    if (items.length > 0) {
      // Image is in a social media message
      return true;
    }

    // Image not found
    return false;
  }

  deleteImage(filePath: string) {
    // Get the name of the file
    const fileParts = filePath.split('/');
    const fileName = fileParts[fileParts.length - 1];

    // Check to see if the image has been used in any upcoming social media messages
    if (this.checkMessagesForImage(filePath)) {
      // tslint:disable-next-line:max-line-length
      this.toast.warning('This image can not be deleted because it is in an upcoming social media message. Change the messages so it isn\'t used then you can delete this image', 'Cannot be deleted');
      return;
    }

    this.alertSvc.swal({
      title: 'Delete image',
      text: 'Are you sure you want to delete this image?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      // Confirmed
      this.fileStore.deleteFile(`contentItem/${this.data.id}/${fileName}`).toPromise()
        .then(deleteResponse => {
          // Remove the image from the list
          const index = this.files.indexOf(filePath);
          this.files.splice(index, 1);
          // Inform the user
          this.toast.success('File deleted');
          this.fileDeleted.emit(filePath);
        })
        .catch(deleteError => {
          console.log('Error deleting file', filePath);
          this.tracking.TrackError(`Unable to delete file ${filePath}`, deleteError);
          this.toast.error('Unable to delete file');
        });
    },
      error => {
        // Error
        console.log('Alert dismissed');
      },
      () => {
        // Complete
      }
    );


  }
}
