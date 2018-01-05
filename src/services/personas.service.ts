import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PersonasService {
  private url: string = environment.baseApiUrl + '/api/persona';

  constructor(private authHttp: AuthHttp) { }

  getAll(): Observable<Persona[]> {
    return this.authHttp.get(this.url).map(response => response.json());
  }

  getSingle(id: string): Observable<Persona>{
    return this.authHttp.get(`${this.url}/${id}`).map(response => response.json());
  }

  create(persona: Persona): Observable<string> {
    return this.authHttp.post(this.url, persona).map(response => response.json());
  }

  update(persona: Persona): Observable<boolean> {
    return this.authHttp.put(this.url, persona).map(response => response.json());
  }

  delete(id:string): Observable<boolean>{
    return this.authHttp.delete(`${this.url}/${id}`, {}).map(response => response.json());
  }
}

export class Persona {
  public id: string;
  public Name: string;
  public ImageUrl: string;
  public BusinessRole: string;
  public KeyAttributes: string[];
  public Age: string;
  public Salary: number;
  public Education: string[];
  public Goals: string[];
  public HowWeHelp: string[];
  public Notes: string;
}
