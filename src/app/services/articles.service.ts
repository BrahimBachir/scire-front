import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IArticle } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getArticlesByRule(ruleId: number): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(
      environment.api_base_url + 
      this.routes.api.articles.all_by_rule.replace(':ruleId', ruleId.toString())
    );
  }

  public getOne(id: number): Observable<IArticle> {
    return this.http.get<IArticle>(
      `${environment.api_base_url}${this.routes.api.articles.base}/${id}`
    );
  }

  public createRule(article: IArticle): Observable<IArticle> {
    return this.http.post<IArticle>(environment.api_base_url + this.routes.api.articles.base, article)
  }

  public updateRule(id: number, article: IArticle): Observable<IArticle> {
    return this.http.patch<IArticle>(`${environment.api_base_url + this.routes.api.articles.base}/${id}`, article)
  }

  public deleteRule(id: number){
    return this.http.delete(`${environment.api_base_url + this.routes.api.articles.base}/${id}`)
  }
}
