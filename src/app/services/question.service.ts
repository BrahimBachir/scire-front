
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, IQuestion, DeletedElement, IncomingNavigableEntity } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class QuestionService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.questions.questions, { params });
  }

  public getOne(id: number): Observable<IQuestion> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.questions}/${id}`;
    return this.http.get<IQuestion>(URL);
  }

  public getByRule(ruleCode: string, artiCode: string): Observable<IQuestion[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.byRule}`
      .replace(':ruleCode', ruleCode)
      .replace(':artiCode',artiCode);
    return this.http.get<IQuestion[]>(URL);
  }

  public getByArticle(articleId: number): Observable<IQuestion> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.byArticle}`.replace(':articleId', articleId.toString());
    return this.http.get<IQuestion>(URL);
  }

    public navigate(articleId: number, queryingDto?: IQueryingDto): Observable<IncomingNavigableEntity> {
    let params = new HttpParams();
    if(queryingDto)
      params = buildParams(queryingDto, params);

    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.navigate}`
      .replace(':articleId', articleId.toString());

    return this.http.get<IncomingNavigableEntity>(URL, { params });
  }
  
  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.questions}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.questions}`;
    return this.http.post(URL, { ids });
  }

  public update(question: IQuestion): Observable<IQuestion> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.questions}/${question.id}`;
    return this.http.patch<IQuestion>(URL, question);
  }

  public create(question: IQuestion) : Observable<IQuestion> {
    let params = new HttpParams();
    let URL = `${environment.api_base_url}${this.routes.api.learning.questions.questions}`;

    return this.http.post<IQuestion>(URL, question, {params});
  }
}