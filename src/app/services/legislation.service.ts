import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto,IMetadataSource, IRuleType, IRuleAmbit, IRule, IParagraph, IRuleIndex, IRuleGazette, IArticle, IIncomingEntity } from '../common/models/interfaces';
import { buildParams } from '../common/utils';

@Injectable({ providedIn: 'root' })
export class LegislationService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  /**
   * 
   * @param queryingDto 
   * @returns 
   */
  public getArticle(articleId: number): Observable<IArticle> {
    return this.http.get<IArticle>(
      environment.api_base_url + 
      this.routes.api.rule.article
        .replace(':articleId', ''+articleId )
    );
  }

  public getRuleArticles(ruleId: number): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(
      environment.api_base_url + 
      this.routes.api.rule.articles.replace(':ruleId', ruleId.toString())
    );
  }

  public getIndex(queryingDto?: IQueryingDto): Observable<IRuleIndex[]> {
    return this.http.get<IRuleIndex[]>(
      environment.api_base_url + this.routes.api.rule.index.replace(':ruleCode', queryingDto?.ruleCode || '')
    );
  }

  public getMetadata(queryingDto?: IQueryingDto): Observable<IMetadataSource | IRule> {
    return this.http.get<IMetadataSource | IRule>(
      environment.api_base_url + this.routes.api.rule.metadata.replace(':ruleCode', queryingDto?.ruleCode || '')
    );
  }

  public getRuleTypes(): Observable<IRuleType[]> {
    return this.http.get<IRuleType[]>(
      environment.api_base_url + this.routes.api.rule.types
    );
  }

  public getRuleAmbits(): Observable<IRuleAmbit[]> {
    return this.http.get<IRuleAmbit[]>(
      environment.api_base_url + this.routes.api.rule.ambits
    );
  }

  public getRuleGazettes(): Observable<IRuleGazette[]> {
    return this.http.get<IRuleGazette[]>(
      environment.api_base_url + this.routes.api.rule.gazettes
    );
  }

  public getRules(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<IIncomingEntity>(
      environment.api_base_url + this.routes.api.rule.base, {params}
    );
  }

  public getRuleById(id: number): Observable<IRule> {
    return this.http.get<IRule>(
      environment.api_base_url + this.routes.api.rule.one_by_id.replace(':id', id.toString())
    );
  }

  public getRuleByCode(code: string): Observable<IRule> {
    return this.http.get<IRule>(
      environment.api_base_url + this.routes.api.rule.one_by_code.replace(':ruleCode', code.toString())
    );
  }

  public createRule(rule: IRule): Observable<IRule> {
    console.log("Creating rule at service: ", rule)
    return this.http.post<IRule>(environment.api_base_url + this.routes.api.rule.base, rule)
  }

  public updateRule(rule: IRule): Observable<IRule> {
    return this.http.patch<IRule>(`${environment.api_base_url + this.routes.api.rule.base}/${rule.id}`, rule)
  }

  public deleteRule(id: number){
    return this.http.delete(`${environment.api_base_url + this.routes.api.rule.base}/${id}`)
  }
}
