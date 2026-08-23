import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routes } from '../common/config';
import { IOrganization, IQueryingDto } from '../common/models/interfaces';
import { environment } from 'src/environments/environment';
import { buildParams } from '../common/utils';

export interface IOrganizationsPage {
  rows: IOrganization[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrganizationsService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  getAll(queryingDto?: IQueryingDto): Observable<IOrganizationsPage> {
    let params = new HttpParams();
    if (queryingDto) params = buildParams(queryingDto, params);

    const URL = `${environment.api_base_url}${this.routes.api.organizations.all}`;
    return this.http.get<IOrganizationsPage>(URL, { params });
  }

  getOne(id: number): Observable<IOrganization> {
    const URL = `${environment.api_base_url}${this.routes.api.organizations.all}/${id}`;
    return this.http.get<IOrganization>(URL);
  }

  create(organization: IOrganization): Observable<IOrganization> {
    const URL = `${environment.api_base_url}${this.routes.api.organizations.all}`;
    return this.http.post<IOrganization>(URL, organization);
  }

  update(organization: IOrganization): Observable<IOrganization> {
    const URL = `${environment.api_base_url}${this.routes.api.organizations.all}/${organization.id}`;
    return this.http.patch<IOrganization>(URL, organization);
  }

  delete(id: number): Observable<void> {
    const URL = `${environment.api_base_url}${this.routes.api.organizations.all}/${id}`;
    return this.http.delete<void>(URL);
  }
}
