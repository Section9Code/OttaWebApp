import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectPersonaService {
  private url: string = environment.baseApiUrl + '/api/ProjectPersona';

  constructor(private authHttp: AuthHttp) { }

  getAll(projectId: string): Observable<ProjectPersona[]> {
    return this.authHttp.get(`${this.url}/${projectId}`).map(response => response.json());
  }

  getSingle(projectId: string, id: string): Observable<ProjectPersona> {
    return this.authHttp.get(`${this.url}/${projectId}/${id}`).map(response => response.json());
  }

  create(projectId: string, persona: ProjectPersona): Observable<ProjectPersona> {
    return this.authHttp.post(`${this.url}/${projectId}`, persona).map(response => response.json());
  }

  update(projectId: string, persona: ProjectPersona): Observable<void> {
    return this.authHttp.put(`${this.url}/${projectId}`, persona).map(() => {});
  }

  delete(projectId: string, id: string): Observable<void> {
    return this.authHttp.delete(`${this.url}/${projectId}/${id}`).map(() => {});
  }
}

export class ProjectPersona {
  public id: string;
  public Partition: string;
  public ProjectId: string;
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