
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, IVideo, IncomingNavigableEntity } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class VideoService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.videos.videos, { params });
  }

  public getOne(id: number): Observable<IVideo> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.videos}/${id}`;
    return this.http.get<IVideo>(URL);
  }

  /**
   * 
   * @param ruleCode 
   * @param artiCode 
   * @returns 
   * @deprecated
   */
  public getByRule(ruleCode: string, artiCode: string): Observable<IVideo> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.byRule}`.replace(':ruleCode', ruleCode).replace(':artiCode',artiCode);
    return this.http.get<IVideo>(URL);
  }

  public getByArticle(articleId: number): Observable<IVideo> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.byArticle}`.replace(':articleId', articleId.toString());
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

  public create(video: IVideo, queryingDto?: IQueryingDto) : Observable<IVideo> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.videos}`;

    return this.http.post<IVideo>(URL, video, {params});
  }

  public navigate(articleId: number, queryingDto?: IQueryingDto): Observable<IncomingNavigableEntity> {
    let params = new HttpParams();
    if(queryingDto)
      params = buildParams(queryingDto, params);

    let URL = `${environment.api_base_url}${this.routes.api.learning.videos.navigate}`.
      replace(':articleId', articleId.toString());
    return this.http.get<IncomingNavigableEntity>(URL, { params });
  }
}