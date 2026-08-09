
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingTests, ITest, ITestQuestion, IDifficulty, ITestType, DeletedElement, ITestResults } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class TestService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getAllTests(queryingDto?: IQueryingDto): Observable<IIncomingTests> {
    let params = new HttpParams();
    if (queryingDto) params = buildParams(queryingDto, params);

    return this.http.get<IIncomingTests>(
      environment.api_base_url + this.routes.api.learning.tests.base,
      { params },
    );
  }

  public getOne(id: number): Observable<ITest> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}/${id}`;
    return this.http.get<ITest>(URL);
  }

  public getResults(id: number, courseId: number): Observable<ITestResults> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.results}`.replace(':testId', id.toString()).replace(':courseId', courseId.toString());
    return this.http.get<ITestResults>(URL);
  }

  public getDifficulties(): Observable<IDifficulty[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.difficulties}`;
    return this.http.get<IDifficulty[]>(URL);
  }

  public getTypes(): Observable<ITestType[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.types}`;
    return this.http.get<ITestType[]>(URL);
  }

  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }

  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}`;
    return this.http.post(URL, { ids });
  }

  public update(test: ITest): Observable<ITest> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}/${test.id}`;
    return this.http.patch<ITest>(URL, test);
  }

  public reset(id: number): Observable<ITest> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}/reset/${id}`;
    return this.http.patch<ITest>(URL, {});
  }

  public updateTestQuestion(tq: ITestQuestion): Observable<ITestQuestion> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.testQuestion}/${tq.id}`;
    return this.http.patch<ITestQuestion>(URL, tq);
  }

  public visitTestQuestion(tq: ITestQuestion): Observable<ITestQuestion> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.testQuestion}/${tq.id}/visit`;
    return this.http.patch<ITestQuestion>(URL, {});
  }

  public create(test: ITest): Observable<ITest> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.tests.base}`;

    return this.http.post<ITest>(URL, test);
  }
}