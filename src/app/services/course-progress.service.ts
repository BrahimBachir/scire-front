
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { buildParams } from '../common/utils';
import { IQueryingDto, IArticleProgress, ICourse, ICourseProgress, ITopicProgress, IAllArticlesProgress } from '../common/models/interfaces';


@Injectable({ providedIn: 'root' })
export class CourseProgressService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) { }

  /**
 * @From GET /learning/courses/progress/:courseId
 */
  public getCourseProgress(queryingDto?: IQueryingDto): Observable<ICourseProgress> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);

    return this.http.get<ICourseProgress>(
      `${environment.api_base_url}${this.routes.api.learning.courses.progress.course}`.replace(':courseId', (queryingDto?.courseId || 0).toString())
      , { params });
  }

  /**
 * @From GET /learning/courses/progress/:courseId/topic/:topicId
 */
  public getTopicProgress(queryingDto?: IQueryingDto): Observable<ITopicProgress> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);

    return this.http.get<ITopicProgress>(
      `${environment.api_base_url}/${this.routes.api.learning.courses.progress.base}/${this.routes.api.learning.courses.progress.topic}`.replace(':topicId', (queryingDto?.topicId || 0).toString()).replace(':courseId', (queryingDto?.courseId || 0).toString())
      , { params });
  }

  /**
   * @From GET /learning/courses/progress/article/:artiCode
   */
  public getOneArticleProgress(queryingDto?: IQueryingDto): Observable<IArticleProgress> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);

    return this.http.get<IArticleProgress>(
      `${environment.api_base_url}${this.routes.api.learning.courses.progress.article}`.replace(':articleId', (queryingDto?.articleId || '').toString())
      , { params });
  }

  /**
   * @From GET /learning/courses/progress/:courseId/topic/:topicId/articles
   */
  public getCourseArticlesProgress(queryingDto?: IQueryingDto): Observable<IAllArticlesProgress> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);

    return this.http.get<IAllArticlesProgress>(
      `${environment.api_base_url}${this.routes.api.learning.courses.progress.course_articles}`.replace(':topicId', (queryingDto?.topicId || 0).toString()).replace(':courseId', (queryingDto?.courseId || 0).toString())
      , { params });
  }

  /**
   * @From GET /learning/courses/progress/:ruleId/articles
   */
  public getRuleArticlesProgress(queryingDto?: IQueryingDto): Observable<IAllArticlesProgress> {
    let params = new HttpParams();
    if (queryingDto)
      params = buildParams(queryingDto, params);

    return this.http.get<IAllArticlesProgress>(
      `${environment.api_base_url}${this.routes.api.learning.courses.progress.rule_articles}`.replace(':ruleId', (queryingDto?.ruleId || 0).toString())
      , { params });
  }

  public update(progress: IArticleProgress): Observable<IArticleProgress> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.progress.base}/${progress.id}`;
    return this.http.patch<IArticleProgress>(URL, progress);
  }

  public create(progress: IArticleProgress): Observable<IArticleProgress> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.progress.base}`;

    return this.http.post<IArticleProgress>(URL, progress);
  }
}