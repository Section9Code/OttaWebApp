import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Persona } from 'services/personas.service';
import { ImagesService } from 'services/images.service';

@Component({
  selector: 'app-content-persona-form',
  templateUrl: './content-persona-form.component.html',
  styleUrls: ['./content-persona-form.component.css']
})
export class ContentPersonaFormComponent implements OnInit {

  @Input() formData: Persona;
  @Input() showProgress: boolean;
  @Input() showDelete: boolean;

  @Output() onSubmit = new EventEmitter<Persona>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();


  // Image upload functions
  isUploadingImage: boolean = false;
  imagesToUpload: Array<File> = [];


  constructor(private imagesService: ImagesService) { }

  ngOnInit(): void {
  }

  cancelPersonaForm() {
    this.onCancel.emit(null);
  }

  submitPersonaForm() {
    this.showProgress = true;
    this.onSubmit.emit(null);
  }

  deletePersonaForm() {
    this.onDelete.emit(null);
  }

  imageUploadFileChanges(fileInput: any) {
    console.log('Image upload change', event);
    this.imagesToUpload = <Array<File>>fileInput.target.files;
  }

  imageUpload() {
    console.log('Upload image');
    this.isUploadingImage = true;
    this.imagesService.upload(this.imagesToUpload[0]).subscribe(
      response => {
        console.log('Image uploaded', response);
        this.formData.ImageUrl = response;
        this.isUploadingImage = false;
      },
      error => {
        console.log('Error occurred uploading image', error);
        this.isUploadingImage = false;
      }
    );
  }

}
