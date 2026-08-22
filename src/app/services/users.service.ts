import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routes } from '../common/config';
import { IQueryingDto, IUser } from '../common/models/interfaces';
import { environment } from 'src/environments/environment';
import { buildParams } from '../common/utils';

export interface IUsersPage {
  rows: IUser[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAllUsers(queryingDto: IQueryingDto): Observable<IUsersPage> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    if (queryingDto.searchTerm && queryingDto.searchTerm.trim() !== '') {
      params = params.append('searchTerm', queryingDto.searchTerm.trim());
    }
    return this.http.get<IUsersPage>(environment.api_base_url + this.routes.api.users.all,
      { params }
    );
  }

  // Provisions a working login (scire-auth) alongside the user record: a
  // random password is generated and emailed, and the user must change it on
  // first sign-in. Only usable by SUPER/ADMIN.
  public provisionUser(user: any): Observable<{ user: IUser; warning?: string }> {
    let URL = `${environment.api_base_url}${this.routes.api.users.provision}`;
    return this.http.post<{ user: IUser; warning?: string }>(URL, user);
  }

  public getOneUser(id: number) {
    let URL = `${environment.api_base_url}${this.routes.api.users.all}/${id}`;
    return this.http.get(URL);
  }

  public getInstructor(id: number): Observable<IUser> {
    let URL = `${environment.api_base_url}${this.routes.api.users.contributor}`.replace(':id', id.toString());
    return this.http.get<IUser>(URL);
   }
  
  public deleteUser(id: number) {
    let URL = `${environment.api_base_url}${this.routes.api.users.all}/${id}`;
    return this.http.delete(URL);
  }
  
  public deleteManyUsers(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.users.bulk_delete}`;
    return this.http.post(URL, { ids });
  }

  public updateUser(user: any) {
    let URL = `${environment.api_base_url}${this.routes.api.users.all}/${user.id}`;
    return this.http.patch(URL, user);
  }

  public changePlan(planCode: string) {
    let URL = `${environment.api_base_url}${this.routes.api.users.plan}`;
    return this.http.patch(URL, { planCode });
  }

  public resetPlan() {
    let URL = `${environment.api_base_url}${this.routes.api.users.plan_reset}`;
    return this.http.post(URL, {});
  }

  public changeRole(roleCode: string) {
    let URL = `${environment.api_base_url}${this.routes.api.users.role}`;
    return this.http.patch(URL, { roleCode });
  }
}
