import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Persona } from 'services/personas.service';
import { TagInputComponent } from 'ngx-chips';
import { ImagesService } from 'services/images.service';

@Component({
    moduleId: module.id,
    selector: 'persona-form',
    templateUrl: 'persona-form.component.html',
    styleUrls: ['persona-form.component.scss']
})
export class PersonaFormComponent implements OnInit {

    @Input() formData: Persona
    @Input() showProgress: boolean;
    @Input() showDelete: boolean;

    @Output() onSubmit = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();

    constructor(private imagesService:ImagesService){}

    ngOnInit(): void {
    }

    cancelPersonaForm() {
        console.log("Cancel clicked");
        this.onCancel.emit(null);
    }

    submitPersonaForm() {
        console.log("Submit clicked");
        this.onSubmit.emit(null);
    }

    deletePersonaForm() {
        console.log('Delete clicked');
        this.onDelete.emit(null);
    }


    // Image upload functions
    isUploadingImage: boolean = false;
    imagesToUpload: Array<File> = [];

    imageUploadFileChanges(fileInput: any) {
        console.log("Image upload change", event);
        this.imagesToUpload = <Array<File>> fileInput.target.files;
    }

    imageUpload() {
        console.log("Upload image");
        this.isUploadingImage = true;
        this.imagesService.upload(this.imagesToUpload[0]).subscribe(
            response =>{
                console.log("Image uploaded", response);
                this.formData.ImageUrl = response;
                this.isUploadingImage = false;
            },
            error => {
                console.log("Error occurred uploading image", error);
                this.isUploadingImage = false;
            }
        );
    }

}
