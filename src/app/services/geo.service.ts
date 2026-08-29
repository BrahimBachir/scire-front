import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { ICountry, ITown } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class GeoService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  getCountries(): Observable<ICountry[]> {
    let URL = `${environment.api_base_url}${this.routes.api.countries.all}`;
    return this.http.get<ICountry[]>(URL);
  }

  getTowns(countryId?: number): Observable<ITown[]> {
    let URL = `${environment.api_base_url}${this.routes.api.towns.all}`;
    let params = new HttpParams();
    if (countryId) params = params.set('countryId', countryId);
    return this.http.get<ITown[]>(URL, { params });
  }
}
