
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, ICourse, ITopic, IArticle } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class TopicService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.topics.topics, { params });
  }

  public getOne(id: number): Observable<ITopic> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.topics}/${id}`;
    return this.http.get<ITopic>(URL);
  }
  
 
  public getBlocks(topicId: number): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.blocks}`.replace(':id', topicId.toString());
    return this.http.get<IIncomingEntity>(URL);
  }

  public getArticles(topicId: number, queryingDto?: IQueryingDto): Observable<IArticle[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.articles}`.replace(':topicId', topicId.toString());
    return this.http.get<IArticle[]>(URL, { params });
  }
  
  public delete(id: number): Observable<string> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.topics}/${id}`;
    return this.http.delete<string>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.topics}`;
    return this.http.post(URL, { ids });
  }

  public update(course: ICourse): Observable<ICourse> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.topics}/${course.id}`;
    return this.http.patch<ICourse>(URL, course);
  }

  public save(course: ICourse, queryingDto?: IQueryingDto) : Observable<ICourse> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.topics}`;

    return this.http.post<ICourse>(URL, course, {params});
  }
}