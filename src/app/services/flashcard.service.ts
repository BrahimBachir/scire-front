
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, IFlashcard, DeletedElement, IncomingNavigableEntity } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class FlashcardService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.flashcards.base, { params });
  }

  public getOne(id: number): Observable<IFlashcard> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.base}/${id}`;
    return this.http.get<IFlashcard>(URL);
  }

  public getByRule(ruleCode: string, artiCode: string): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.byRule}`
      .replace(':ruleCode', ruleCode)
      .replace(':artiCode',artiCode);
    return this.http.get<IIncomingEntity>(URL);
  }

  public navigate(articleId: number, queryingDto?: IQueryingDto): Observable<IncomingNavigableEntity> {
    let params = new HttpParams();
    if(queryingDto)
      params = buildParams(queryingDto, params);

    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.navigate}`.
      replace(':articleId', articleId.toString());
    return this.http.get<IncomingNavigableEntity>(URL, { params });
  }
  
  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.base}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.base}`;
    return this.http.post(URL, { ids });
  }

  public update(flashcard: IFlashcard): Observable<IFlashcard> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.base}/${flashcard.id}`;
    return this.http.patch<IFlashcard>(URL, flashcard);
  }

  public create(flashcard: IFlashcard, queryingDto?: IQueryingDto) : Observable<IFlashcard> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.base}`;

    return this.http.post<IFlashcard>(URL, flashcard, {params});
  }
}