
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { QueryingDto, IIncomingEntity, IVideo } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class VideoService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: QueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.videos.videos, { params });
  }

  public getOne(id: number): Observable<IVideo> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.videos}/${id}`;
    return this.http.get<IVideo>(URL);
  }

  public getByRule(ruleCode: string, artiCode: string): Observable<IVideo> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.byRule}`.replace(':ruleCode', ruleCode).replace(':artiCode',artiCode);
    return this.http.get<IVideo>(URL);
  }
  
  public delete(id: number): Observable<string> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.videos}/${id}`;
    return this.http.delete<string>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.videos}`;
    return this.http.post(URL, { ids });
  }

  public update(video: IVideo): Observable<IVideo> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.videos}/${video.id}`;
    return this.http.patch<IVideo>(URL, video);
  }

  public create(video: IVideo, queryingDto?: QueryingDto) : Observable<IVideo> {
    console.log(queryingDto)
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.videos}`;

    return this.http.post<IVideo>(URL, video, {params});
  }
}