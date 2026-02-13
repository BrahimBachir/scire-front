
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { AIGeneration, IFlashcard, IDiagram, IQuestion } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class AIService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public generateElement(element: AIGeneration): Observable<IFlashcard[] | IDiagram[] | IQuestion[]> {
    let URL = `${environment.api_base_url}${this.routes.api.ai.base}`;
    return this.http.post<IFlashcard[] | IDiagram[] | IQuestion[]>(URL, element);
  }
}