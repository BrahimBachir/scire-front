import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routes } from '../common/config';
import { IQueryingDto, IUser } from '../common/models/interfaces';
import { UsersState } from '../common/models/states';
import { environment } from 'src/environments/environment';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class UsersService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAllUsers(queryingDto: IQueryingDto): Observable<UsersState> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    if (queryingDto.searchTerm && queryingDto.searchTerm.trim() !== '') {
      params = params.append('searchTerm', queryingDto.searchTerm.trim());
    }
    return this.http.get<UsersState>(environment.api_base_url + this.routes.api.users.all
    );
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
    let URL = `${environment.api_base_url}${this.routes.api.users.all}`;
    return this.http.post(URL, { ids });
  }

  public updateUser(user: any) {
    let URL = `${environment.api_base_url}${this.routes.api.users.all}`;
    return this.http.patch(URL, user);
  }
}
