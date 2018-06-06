import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

@Injectable()
export class CouponService {
  private url: string = environment.baseApiUrl + '/api/offer';

  constructor(private http: Http) {
  }

  getOffer(offerCode: string): Observable<string> {
      return this.http.get(`${this.url}?offerCode=${offerCode}`).map(response => response.json());
  }

}
