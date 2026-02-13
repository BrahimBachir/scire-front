
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, IDiagram, IncomingNavigableEntity, DeletedElement } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class DiagramService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.diagrams.base, { params });
  }

  public getOne(id: number): Observable<IDiagram> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.base}/${id}`;
    return this.http.get<IDiagram>(URL);
  }

  public getByRule(ruleCode: string, artiCode: string): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.byArticle}`.replace(':ruleCode', ruleCode).replace(':artiCode',artiCode);
    return this.http.get<IIncomingEntity>(URL);
  }

  public getByArticle(articleId: number): Observable<IDiagram> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.byRule}`.replace(':articleId', articleId.toString());
    return this.http.get<IDiagram>(URL);
  }

  public navigate(articleId: number, queryingDto?: IQueryingDto): Observable<IncomingNavigableEntity> {
    let params = new HttpParams();
    if(queryingDto)
      params = buildParams(queryingDto, params);

    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.navigate}`.
      replace(':articleId', articleId.toString());
    return this.http.get<IncomingNavigableEntity>(URL, { params });
  }
  
  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.base}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.base}`;
    return this.http.post(URL, { ids });
  }

  public update(diagram: IDiagram): Observable<IDiagram> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.base}/${diagram.id}`;
    return this.http.patch<IDiagram>(URL, diagram);
  }

  public create(diagram: IDiagram, queryingDto?: IQueryingDto) : Observable<IDiagram> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.diagrams.base}`;

    return this.http.post<IDiagram>(URL, diagram, {params});
  }
}