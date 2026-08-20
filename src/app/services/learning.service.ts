import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, ITopicCategory, ISection, ITopic, IQuestion, IFlashcard, IVideo, IGanttTask, IIncomingEntity, DeletedElement } from '../common/models/interfaces';
import { buildParams } from '../common/utils';

@Injectable({ providedIn: 'root' })
export class LearningService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getCategories(queryingDto?: IQueryingDto): Observable<ITopicCategory[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<ITopicCategory[]>(
      environment.api_base_url + this.routes.api.learning.categories, {params}
    );
  }

  public getSections(queryingDto?: IQueryingDto): Observable<ISection[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<ISection[]>(
      environment.api_base_url + this.routes.api.learning.sections, {params}
    );
  }

  public getCategoriesByCourse(courseId: number): Observable<ITopicCategory[]> {
    const url = `${environment.api_base_url}${this.routes.api.learning.categoriesByCourse}`.replace(':courseId', courseId.toString());
    return this.http.get<ITopicCategory[]>(url);
  }

  public createCategory(payload: { name: string; courseId?: number }): Observable<ITopicCategory> {
    return this.http.post<ITopicCategory>(
      environment.api_base_url + this.routes.api.learning.categories, payload
    );
  }

  public associateCategoryToCourse(courseId: number, categoryId: number): Observable<unknown> {
    const url = `${environment.api_base_url}${this.routes.api.learning.categoriesByCourse}`.replace(':courseId', courseId.toString());
    return this.http.post(url, { categoryId });
  }

  public removeCategoryFromCourse(courseId: number, categoryId: number): Observable<DeletedElement> {
    const url = `${environment.api_base_url}${this.routes.api.learning.categoriesByCourse}/${categoryId}`.replace(':courseId', courseId.toString());
    return this.http.delete<DeletedElement>(url);
  }

  public getSectionsByCourse(courseId: number): Observable<ISection[]> {
    const url = `${environment.api_base_url}${this.routes.api.learning.sectionsByCourse}`.replace(':courseId', courseId.toString());
    return this.http.get<ISection[]>(url);
  }

  public createSection(payload: { name: string; category: { id: number }; courseId?: number }): Observable<ISection> {
    return this.http.post<ISection>(
      environment.api_base_url + this.routes.api.learning.sections, payload
    );
  }

  public associateSectionToCourse(courseId: number, sectionId: number): Observable<unknown> {
    const url = `${environment.api_base_url}${this.routes.api.learning.sectionsByCourse}`.replace(':courseId', courseId.toString());
    return this.http.post(url, { sectionId });
  }

  public removeSectionFromCourse(courseId: number, sectionId: number): Observable<DeletedElement> {
    const url = `${environment.api_base_url}${this.routes.api.learning.sectionsByCourse}/${sectionId}`.replace(':courseId', courseId.toString());
    return this.http.delete<DeletedElement>(url);
  }

  public getTopics(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<IIncomingEntity>(
      environment.api_base_url + this.routes.api.learning.topics.base, {params}
    );
  }

  public getOneTopic(id: number): Observable<ITopic> {
    return this.http.get<ITopic>(
      `${environment.api_base_url + this.routes.api.learning.topics}/${id}`
    );
  }

  public getQuestions( type: string, queryingDto?: IQueryingDto): Observable<IQuestion[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    params = params.append('type', type);

    return this.http.get<IQuestion[]>(
      environment.api_base_url + this.routes.api.learning.questions, {params}
    );
  }

  public getFlashcards( queryingDto?: IQueryingDto): Observable<IFlashcard[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<IFlashcard[]>(
      environment.api_base_url + this.routes.api.learning.flashcards, {params}
    );
  }

  public getVideos( queryingDto?: IQueryingDto): Observable<IVideo[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<IVideo[]>(
      environment.api_base_url + this.routes.api.learning.flashcards, {params}
    );
  }


  public createTask(task: IGanttTask): Observable<IGanttTask> {
    return this.http.post<IGanttTask>(environment.api_base_url + this.routes.api.learning.flashcards, task)
  }

  public updateTask(id: number, task: IGanttTask): Observable<IGanttTask> {
    return this.http.patch<IGanttTask>(environment.api_base_url + this.routes.api.learning.tracker + '/'+ id, task)
  }
}
