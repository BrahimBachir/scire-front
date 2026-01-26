
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, IScheme, IncomingNavigableEntity, DeletedElement } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class SchemeService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.schemes.schemes, { params });
  }

  public getOne(id: number): Observable<IScheme> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.schemes}/${id}`;
    return this.http.get<IScheme>(URL);
  }

  public getByRule(ruleCode: string, artiCode: string): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.byArticle}`.replace(':ruleCode', ruleCode).replace(':artiCode',artiCode);
    return this.http.get<IIncomingEntity>(URL);
  }

  public getByArticle(articleId: number): Observable<IScheme> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.byRule}`.replace(':articleId', articleId.toString());
    return this.http.get<IScheme>(URL);
  }

  public navigate(articleId: number, queryingDto?: IQueryingDto): Observable<IncomingNavigableEntity> {
    let params = new HttpParams();
    if(queryingDto)
      params = buildParams(queryingDto, params);

    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.navigate}`.
      replace(':articleId', articleId.toString());
    return this.http.get<IncomingNavigableEntity>(URL, { params });
  }
  
  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.schemes}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.schemes}`;
    return this.http.post(URL, { ids });
  }

  public update(scheme: IScheme): Observable<IScheme> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.schemes}/${scheme.id}`;
    return this.http.patch<IScheme>(URL, scheme);
  }

  public create(scheme: IScheme, queryingDto?: IQueryingDto) : Observable<IScheme> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.schemes.schemes}`;

    return this.http.post<IScheme>(URL, scheme, {params});
  }
}