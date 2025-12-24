import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { QueryingDto, ITopic } from '../common/models/interfaces';
import { buildParams } from '../common/utils';

@Injectable({ providedIn: 'root' })
export class GanttService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getGanttData(queryingDto?: QueryingDto): Observable<ITopic[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<ITopic[]>(
      environment.api_base_url + this.routes.api.learning.tasks, {params}
    );
  }
}