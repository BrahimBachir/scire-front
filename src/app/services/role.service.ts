import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IRole } from '../common/models/interfaces';

export interface Role {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}
    getAll(): Observable<IRole[]> {
        let URL = `${environment.api_base_url}${this.routes.api.roles.all}`;
        console.log("URL: ", URL)
        return this.http.get<IRole[]>(URL);
    }

    getOne(id: number): Observable<IRole> {
        let URL = `${environment.api_base_url}${this.routes.api.roles.all}/${id}`;
        return this.http.get<IRole>(URL);
    }

    create(role: IRole): Observable<IRole> {
        let URL = `${environment.api_base_url}${this.routes.api.roles.all}`;
        return this.http.post<IRole>(URL, role);
    }

    update(role: IRole): Observable<IRole> {
        let URL = `${environment.api_base_url}${this.routes.api.roles.all}/${role.id}`;
        return this.http.put<IRole>(URL, role);
    }

    delete(id: number): Observable<void> {
        let URL = `${environment.api_base_url}${this.routes.api.roles.all}/${id}`;
        return this.http.delete<void>(URL);
    }
}