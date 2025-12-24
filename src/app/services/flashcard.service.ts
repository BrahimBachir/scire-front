
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { QueryingDto, IIncomingEntity, IFlashcard } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class FlashcardService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: QueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.flashcards.flashcards, { params });
  }

  public getOne(id: number): Observable<IFlashcard> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.flashcards}/${id}`;
    return this.http.get<IFlashcard>(URL);
  }

  public getByRule(ruleCode: string, artiCode: string): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.byRule}`
      .replace(':ruleCode', ruleCode)
      .replace(':artiCode',artiCode);
    return this.http.get<IIncomingEntity>(URL);
  }

  public navigate(ruleCode: string, artiCode: string, queryingDto: QueryingDto): Observable<IFlashcard> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    console.log("Data to be sent: ",queryingDto.direction, queryingDto.flashcardId)

    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.navigate}`
      .replace(':ruleCode', ruleCode || '').
      replace(':artiCode', artiCode || '');
    return this.http.get<IFlashcard>(URL, { params });
  }
  
  public delete(id: number): Observable<string> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.flashcards}/${id}`;
    return this.http.delete<string>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.flashcards}`;
    return this.http.post(URL, { ids });
  }

  public update(flashcard: IFlashcard): Observable<IFlashcard> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.flashcards}/${flashcard.id}`;
    return this.http.patch<IFlashcard>(URL, flashcard);
  }

  public create(flashcard: IFlashcard, queryingDto?: QueryingDto) : Observable<IFlashcard> {
    console.log(queryingDto)
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.flashcards.flashcards}`;

    return this.http.post<IFlashcard>(URL, flashcard, {params});
  }
}