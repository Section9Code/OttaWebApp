import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ImagesService {
  private url: string = environment.baseApiUrl + '/api/images';

  constructor(private authHttp: AuthHttp) { }

  // Upload a file
  upload(image: File): Observable<string> {
    // Create the form data to send to the API
    let form: FormData = new FormData();
    form.append('file[]', image);
    // Send
    return this.authHttp.post(this.url, form).map(response => response.json());
  }

  // Get all the files in a folder
  getAllFilesInFolder(folderName: string): Observable<string[]> {
    return this.authHttp.get(`${this.url}?folderName=${folderName}`).map(response => response.json());
  }

  // Delete a file
  deleteFile(path: string): Observable<boolean>{
    return this.authHttp.delete(`${this.url}?path=${path}`).map(response => response.json());
  }

}

