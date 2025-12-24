
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { QueryingDto, IIncomingEntity, INote } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class NoteService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: QueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.notes.notes, { params });
  }

  public getOne(id: number): Observable<INote> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.notes.notes}/${id}`;
    return this.http.get<INote>(URL);
  }

  public getByRule(ruleCode: string, artiCode: string): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.notes.byRule}`.replace(':ruleCode', ruleCode).replace(':artiCode',artiCode);
    return this.http.get<IIncomingEntity>(URL);
  }

  public navigate(ruleCode: string, artiCode: string, queryingDto: QueryingDto): Observable<INote> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);

    console.log("Data to be sent: ",queryingDto.direction, queryingDto.noteId)

    let URL = `${environment.api_base_url}${this.routes.api.learning.notes.navigate}`
      .replace(':ruleCode', ruleCode || '')
      .replace(':artiCode', artiCode || '');
    return this.http.get<INote>(URL, { params });
  }
  
  public delete(id: number): Observable<string> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.notes.notes}/${id}`;
    return this.http.delete<string>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.notes.notes}`;
    return this.http.post(URL, { ids });
  }

  public update(note: INote): Observable<INote> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.notes.notes}/${note.id}`;
    return this.http.patch<INote>(URL, note);
  }

  public create(note: INote) : Observable<INote> {
    console.log("Note from the front: ", note)

    let URL = `${environment.api_base_url}${this.routes.api.learning.notes.notes}`;

    return this.http.post<INote>(URL, note);
  }
}