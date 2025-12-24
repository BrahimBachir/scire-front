import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IGender } from '../common/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class GendersService {
    routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}
    getAll(): Observable<IGender[]> {
        let URL = `${environment.api_base_url}${this.routes.api.genders.all}`;
        console.log("URL: ", URL)
        return this.http.get<IGender[]>(URL);
    }

    getOne(id: number): Observable<IGender> {
        let URL = `${environment.api_base_url}${this.routes.api.genders.all}/${id}`;
        return this.http.get<IGender>(URL);
    }

    create(gender: IGender): Observable<IGender> {
        let URL = `${environment.api_base_url}${this.routes.api.genders.all}`;
        return this.http.post<IGender>(URL, gender);
    }

    update(gender: IGender): Observable<IGender> {
        let URL = `${environment.api_base_url}${this.routes.api.genders.all}/${gender.id}`;
        return this.http.put<IGender>(URL, gender);
    }

    delete(id: number): Observable<void> {
        let URL = `${environment.api_base_url}${this.routes.api.genders.all}/${id}`;
        return this.http.delete<void>(URL);
    }
}