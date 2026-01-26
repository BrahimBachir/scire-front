
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, ICourse, ICourseType, ICaller, ITopic } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class ConfigService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getVariables(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.courses.base, { params });
  }

  public getPlanes(): Observable<any> {
    let URL = `${environment.api_base_url}${this.routes.api.config.pricing_planes}`;
    return this.http.get<any>(URL);
  }
}