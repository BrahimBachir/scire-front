
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { QueryingDto, IIncomingEntity, ICourse, ICourseType, ICallingOrg, ITopic } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class CourseService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: QueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.courses.courses, { params });
  }

  public getOne(id: number): Observable<ICourse> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.courses}/${id}`;
    return this.http.get<ICourse>(URL);
  }

  public getMyCourses(): Observable<ICourse[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.my_courses}`;
    return this.http.get<ICourse[]>(URL);
  }
  
  public getTypes(): Observable<ICourseType[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.types}`;
    return this.http.get<ICourseType[]>(URL);
  }

  public getCallingOrgs(): Observable<ICallingOrg[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.callingOrgs}`;
    return this.http.get<ICallingOrg[]>(URL);
  }

  public getTopics(courseId: number): Observable<IIncomingEntity> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.topics}`.replace(':id', courseId.toString());
    return this.http.get<IIncomingEntity>(URL);
  }

  public joinCourse(courseId: number) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.join}`.replace(':id', courseId.toString());
    return this.http.post(URL, {});
  }

  public unJoinCourse(courseId: number) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.un_join}`.replace(':id', courseId.toString());
    return this.http.post(URL,{});
  }

  public manageCourseFavourite(courseId: number, favourite: boolean) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.favourite}`.replace(':id', courseId.toString());
    return this.http.post(URL,{favourite});
  }

  public isFavourite(courseId: number): Observable<boolean>  {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.is_favourite}`.replace(':id', courseId.toString());
    return this.http.get<boolean>(URL);
  }

  public isJoined(courseId: number): Observable<boolean> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.is_join}`.replace(':id', courseId.toString());
    return this.http.get<boolean>(URL);
  }
  
  public delete(id: number): Observable<string> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.courses}/${id}`;
    return this.http.delete<string>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.courses}`;
    return this.http.post(URL, { ids });
  }

  public update(course: ICourse): Observable<ICourse> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.courses}/${course.id}`;
    return this.http.patch<ICourse>(URL, course);
  }

  public save(course: ICourse, queryingDto?: QueryingDto) : Observable<ICourse> {
    console.log(queryingDto)
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.courses}`;

    return this.http.post<ICourse>(URL, course, {params});
  }
}