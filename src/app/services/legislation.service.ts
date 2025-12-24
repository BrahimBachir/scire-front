import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { QueryingDto,IMetadataSource, IRuleType, IRuleAmbit, IRule, IParagraph, IRuleIndex, IGazette, IArticle } from '../common/models/interfaces';
import { buildParams } from '../common/utils';

@Injectable({ providedIn: 'root' })
export class LegislationService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getArticle(queryingDto?: QueryingDto): Observable<IArticle> {
    return this.http.get<IArticle>(
      environment.api_base_url + 
      this.routes.api.rule.articles.replace(':ruleCode', queryingDto?.ruleCode || '')
        .replace(':artiCode', queryingDto?.artiCode ? queryingDto.artiCode : '' )
    );
  }

  public getIndex(queryingDto?: QueryingDto): Observable<IRuleIndex[]> {
    return this.http.get<IRuleIndex[]>(
      environment.api_base_url + this.routes.api.rule.index.replace(':ruleCode', queryingDto?.ruleCode || '')
    );
  }

  public getMetadata(queryingDto?: QueryingDto): Observable<IMetadataSource | IRule> {
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

  public getRuleGazettes(): Observable<IGazette[]> {
    return this.http.get<IGazette[]>(
      environment.api_base_url + this.routes.api.rule.gazettes
    );
  }

  public getRules(queryingDto?: QueryingDto): Observable<IRule[]> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    return this.http.get<IRule[]>(
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
    console.log("Creating rule: ", rule);
    return this.http.post<IRule>(environment.api_base_url + this.routes.api.rule.base, rule)
  }

  public updateRule(id: number, rule: IRule): Observable<IRule> {
    return this.http.patch<IRule>(`${environment.api_base_url + this.routes.api.rule.base}/${id}`, rule)
  }

  public deleteRule(id: number){
    return this.http.delete(`${environment.api_base_url + this.routes.api.rule.base}/${id}`)
  }
}
