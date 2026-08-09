
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, IExercise, DeletedElement, IncomingNavigableEntity, IExerciseType } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class ExerciseService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(): Observable<IExercise[]> {    
    return this.http.get<IExercise[]>(environment.api_base_url + this.routes.api.learning.exercises.base);
  }

  public getAllByCourse(courseId: number): Observable<IExercise[]> {
    return this.http.get<IExercise[]>(environment.api_base_url + this.routes.api.learning.exercises.by_course.replace(':courseId', courseId.toString()));
  }

  public getTypes(): Observable<IExerciseType[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.exercises.types}`;
    return this.http.get<IExerciseType[]>(URL);
  }

  public getOne(id: number): Observable<IExercise> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.exercises.base}/${id}`;
    return this.http.get<IExercise>(URL);
  }

  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.exercises.base}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.exercises.base}`;
    return this.http.post(URL, { ids });
  }

  public update(exercise: IExercise): Observable<IExercise> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.exercises.base}/${exercise.id}`;
    return this.http.patch<IExercise>(URL, exercise);
  }

  public create(exercise: IExercise, queryingDto?: IQueryingDto) : Observable<IExercise> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.exercises.base}`;

    return this.http.post<IExercise>(URL, exercise, {params});
  }
}