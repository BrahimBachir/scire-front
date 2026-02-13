
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingTests, ITest, ITestQuestion, IDifficulty, ITestType } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class TestService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAllTests(queryingDto?: IQueryingDto): Observable<IIncomingTests> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingTests>(environment.api_base_url + this.routes.api.learning.tests.base, { params });
  }

  public getOneTestById(id: number): Observable<ITest> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}/${id}`;
    return this.http.get<ITest>(URL);
  }
  
  public getLastTest(): Observable<ITest> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.lastTest}`;
    return this.http.get<ITest>(URL);
  }

  public getDifficulties(): Observable<IDifficulty[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.difficulties}`;
    return this.http.get<IDifficulty[]>(URL);
  }

  public getTypes(): Observable<ITestType[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.types}`;
    return this.http.get<ITestType[]>(URL);
  }
  
  public deleteTest(id: number): Observable<string> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}/${id}`;
    return this.http.delete<string>(URL);
  }
  
  public deleteManyTests(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}`;
    return this.http.post(URL, { ids });
  }

  public updateTest(test: ITest): Observable<ITest> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}/${test.id}`;
    return this.http.patch<ITest>(URL, test);
  }

  public updateTestQuestion(question: ITestQuestion): Observable<ITestQuestion> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.testQuestion}/${question.id}`;
    return this.http.patch<ITestQuestion>(URL, question);
  }

  public saveTest(test: ITest, queryingDto?: IQueryingDto) : Observable<ITest> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}`;

    return this.http.post<ITest>(URL, test, {params});
  }
}