import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { QueryingDto, ITrackRegister } from '../common/models/interfaces';
import { buildParams } from '../common/utils';

@Injectable({ providedIn: 'root' })
export class TrackerService {
  routes = Routes;
  constructor(private http: HttpClient) { }

  public getTrackerRegister(queryingDto?: QueryingDto): Observable<ITrackRegister[]> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);

    return this.http.get<ITrackRegister[]>(
      environment.api_base_url + this.routes.api.learning.tracker, { params }
    );
  }

  public getOneTrackerRegister(id: number): Observable<ITrackRegister> {
    return this.http.get<ITrackRegister>(
      `${environment.api_base_url + this.routes.api.learning.tracker}/${id}`
    );
  }

  public createTrackerRegister(trackRegister: ITrackRegister): Observable<ITrackRegister> {
    console.log("Regsiter at the service: ", trackRegister)
    return this.http.post<ITrackRegister>(`${environment.api_base_url + this.routes.api.learning.tracker}`, trackRegister);
  }

  public updateTrackerRegister(id: number, payload: ITrackRegister): Observable<ITrackRegister> {
    return this.http.put<ITrackRegister>(
      `${environment.api_base_url + this.routes.api.learning.tracker}/${id}`,
      payload
    );
  }

  public deleteTrackerRegister(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.api_base_url + this.routes.api.learning.tracker}/${id}`
    );
  }
}