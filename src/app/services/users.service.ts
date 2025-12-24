import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routes } from '../common/config';
import { QueryingDto } from '../common/models/interfaces';
import { UsersState } from '../common/models/states';
import { environment } from 'src/environments/environment';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class UsersService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAllUsers(queryingDto: QueryingDto): Observable<UsersState> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    if (queryingDto.searchTerm && queryingDto.searchTerm.trim() !== '') {
      params = params.append('searchTerm', queryingDto.searchTerm.trim());
    }
    return this.http.get<UsersState>(environment.api_base_url + this.routes.api.users.all
      // this.defaultConfigService.getVariable(API_ROUTE_BASE_URL) +
      //   this.defaultConfigService.getVariable(API_ROUTE_USERS), {params: params}
    );
  }

  public getOneUser(id: number) {
    //let URL = `${this.defaultConfigService.getVariable(API_ROUTE_BASE_URL)}${this.defaultConfigService.getVariable(API_ROUTE_USERS)}/${id}`;
    let URL = `${environment.api_base_url}${this.routes.api.users.all}/${id}`;
    return this.http.get(URL);
  }
  
  public deleteUser(id: number) {
    //let URL = `${this.defaultConfigService.getVariable(API_ROUTE_BASE_URL)}${this.defaultConfigService.getVariable(API_ROUTE_USERS)}/${id}`;
    let URL = `${environment.api_base_url}${this.routes.api.users.all}/${id}`;
    return this.http.delete(URL);
  }
  
  public deleteManyUsers(ids: number[]) {
    //let base = this.defaultConfigService.getVariable(API_ROUTE_BASE_URL);
    //let endpoint = this.defaultConfigService.getVariable(API_ROUTE_USERS_DELETE_MANY);
    
    //let URL = base + endpoint;
    let URL = `${environment.api_base_url}${this.routes.api.users.all}`;
    return this.http.post(URL, { ids });
  }

  public updateUser(user: any) {
    //let URL = `${this.defaultConfigService.getVariable(API_ROUTE_BASE_URL)}${this.defaultConfigService.getVariable(API_ROUTE_USERS)}/${user.id}`;
    let URL = `${environment.api_base_url}${this.routes.api.users.all}`;
    return this.http.patch(URL, user);
  }
}
