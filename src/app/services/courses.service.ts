
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IQueryingDto, IIncomingEntity, ICourse, ICourseType, ICaller, ICourseCategory, ICourseStatus, IUser, DeletedElement } from '../common/models/interfaces';
import { buildParams } from '../common/utils';


@Injectable({ providedIn: 'root' })
export class CourseService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getAll(queryingDto?: IQueryingDto): Observable<IIncomingEntity> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    
    return this.http.get<IIncomingEntity>(environment.api_base_url + this.routes.api.learning.courses.base, { params });
  }

  public getOne(id: number): Observable<ICourse> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.base}/${id}`;
    return this.http.get<ICourse>(URL);
  }

/*   public getInstructor(courseId: number): Observable<IUser> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.instructor}/`.replace(':id', courseId.toString());
    return this.http.get<IUser>(URL);
  } */

  public getMyCourses(): Observable<ICourse[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.my_courses}`;
    return this.http.get<ICourse[]>(URL);
  }
  
  public getTypes(): Observable<ICourseType[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.types}`;
    return this.http.get<ICourseType[]>(URL);
  }

  public getTags(): Observable<string[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.tags}`;
    return this.http.get<string[]>(URL);
  }

  public getStatuses(): Observable<ICourseStatus[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.statuses}`;
    return this.http.get<ICourseStatus[]>(URL);
  }

  public getCaller(): Observable<ICaller[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.callingOrgs}`;
    return this.http.get<ICaller[]>(URL);
  }

  public getCategories(): Observable<ICourseCategory[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.categories}`;
    return this.http.get<ICourseCategory[]>(URL);
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
  
  public delete(id: number): Observable<DeletedElement> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.base}/${id}`;
    return this.http.delete<DeletedElement>(URL);
  }
  
  public deleteMany(ids: number[]) {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.base}`;
    return this.http.post(URL, { ids });
  }

  public update(course: ICourse): Observable<ICourse> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.base}/${course.id}`;
    return this.http.patch<ICourse>(URL, course);
  }

  public create(course: ICourse, queryingDto?: IQueryingDto) : Observable<ICourse> {
    let params = new HttpParams();
    if(queryingDto)
        params = buildParams(queryingDto, params);
    let URL = `${environment.api_base_url}${this.routes.api.learning.courses.base}`;

    return this.http.post<ICourse>(URL, course, {params});
  }
}