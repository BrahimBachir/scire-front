import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { BulkImportType, IBulkImportJob, IBulkImportValidationReport } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class BulkUploadService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  downloadTemplate(courseId: number, type: BulkImportType): Observable<HttpResponse<Blob>> {
    const URL = `${environment.api_base_url}${this.routes.api.learning.courses.bulkUpload.template}`.replace(
      ':id',
      courseId.toString(),
    );
    const params = new HttpParams().set('type', type);
    return this.http.get(URL, { params, responseType: 'blob', observe: 'response' });
  }

  validate(courseId: number, type: BulkImportType, file: File): Observable<IBulkImportValidationReport> {
    const URL = `${environment.api_base_url}${this.routes.api.learning.courses.bulkUpload.validate}`.replace(
      ':id',
      courseId.toString(),
    );
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<IBulkImportValidationReport>(URL, formData);
  }

  createJob(courseId: number, type: BulkImportType, file: File): Observable<IBulkImportJob> {
    const URL = `${environment.api_base_url}${this.routes.api.learning.courses.bulkUpload.jobs}`.replace(
      ':id',
      courseId.toString(),
    );
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<IBulkImportJob>(URL, formData);
  }

  listJobs(courseId: number): Observable<IBulkImportJob[]> {
    const URL = `${environment.api_base_url}${this.routes.api.learning.courses.bulkUpload.jobs}`.replace(
      ':id',
      courseId.toString(),
    );
    return this.http.get<IBulkImportJob[]>(URL);
  }

  getJob(courseId: number, jobId: number): Observable<IBulkImportJob> {
    const URL = `${environment.api_base_url}${this.routes.api.learning.courses.bulkUpload.job}`
      .replace(':id', courseId.toString())
      .replace(':jobId', jobId.toString());
    return this.http.get<IBulkImportJob>(URL);
  }
}