import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SideInfoService {
  private url: string = environment.baseApiUrl + '/api/sideinfo';

  constructor(
    private authHttp: AuthHttp
  ) { }

  GetSideInfo(pageUrl: string): Observable<string> {
    return this.authHttp.get(`${this.url}/GetSideInfo?path=${pageUrl}`).map(response => response.json());
  }

}
