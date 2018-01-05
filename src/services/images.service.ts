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

  upload(image: File): Observable<string> {
    // Create the form data to send to the API
    let form:FormData = new FormData();
    form.append('file[]', image);    
    // Send
    return this.authHttp.post(this.url, form).map(response => response.json());
  }

}

