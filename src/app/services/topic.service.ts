
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, ITopic, IArticle, DeletedElement, ITopicCourse } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class TopicService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) { }

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);

    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.topics.base, { params });
  }

  public getByCourse(courseId: number): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.by_course}`.replace(':courseId', courseId.toString());

    return this.http.get<IIncomingEntity>(URL);
  }

    public getSyllabus(courseId: number): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.syllabus}`.replace(':courseId', courseId.toString());

    return this.http.get<IIncomingEntity>(URL);
  }

  public getOne(id: number): Observable<ITopic> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.base}/${id}`;
    return this.http.get<ITopic>(URL);
  }


  public getBlocks(topicId: number): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.blocks}`.replace(':id', topicId.toString());
    return this.http.get<IIncomingEntity>(URL);
  }

  public getArticles(topicId: number, queryingDto?: IQueryingDto): Observable<IArticle[]> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.articles}`.replace(':topicId', topicId.toString());
    return this.http.get<IArticle[]>(URL, { params });
  }

  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.base}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }

  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.base}`;
    return this.http.post(URL, { ids });
  }

  public update(topic: ITopic): Observable<ITopic> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.base}/${topic.id}`;
    return this.http.patch<ITopic>(URL, topic);
  }

  public create(topic: ITopic): Observable<ITopic> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.base}`;

    return this.http.post<ITopic>(URL, topic);
  }

  public addToCourse(toco: ITopicCourse): Observable<ITopicCourse> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.topics.by_course}`.replace(':courseId', toco.courseId.toString());

    return this.http.post<ITopicCourse>(URL, toco);
  }

  /*   public save(topic: ITopic, queryingDto?: IQueryingDto) : Observable<ITopic> {
      let params = new HttpParams();
      if(queryingDto)
          params = buildParams(queryingDto, params);
      let URL = `${environment.api_base_url}${this.routes.api.learning.topics.base}`;
  
      return this.http.post<ITopic>(URL, topic, {params});
    } */
}