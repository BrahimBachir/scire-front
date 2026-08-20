import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';
import { finalize, interval, startWith, switchMap } from 'rxjs';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { BulkUploadService } from 'src/app/services';
import {
  BULK_IMPORT_TYPE_OPTIONS,
  BulkImportStatus,
  BulkImportType,
  IBulkImportJob,
  IBulkImportValidationReport,
} from 'src/app/common/models/interfaces';

const JOB_POLL_INTERVAL_MS = 4000;
const ACTIVE_STATUSES: BulkImportStatus[] = ['PENDING', 'IN_PROGRESS'];

@Component({
  selector: 'app-course-upload',
  imports: [CommonModule, MaterialModule, IconModule, NgxDropzoneModule],
  templateUrl: './course-upload.component.html',
  styleUrl: './course-upload.component.scss',
})
export class CourseUploadComponent implements OnInit, OnDestroy {
  private service = inject(BulkUploadService);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToastrService);

  courseId = Number(this.route.snapshot.paramMap.get('courseId')) || 0;

  typeOptions = BULK_IMPORT_TYPE_OPTIONS;
  selectedType = signal<BulkImportType>('TOPIC');

  selectedFile = signal<File | null>(null);
  validating = signal(false);
  report = signal<IBulkImportValidationReport | null>(null);

  submitting = signal(false);
  jobs = signal<IBulkImportJob[]>([]);

  private pollSubscription?: { unsubscribe: () => void };
  private previousStatuses = new Map<number, BulkImportStatus>();

  ngOnInit(): void {
    this.pollSubscription = interval(JOB_POLL_INTERVAL_MS)
      .pipe(startWith(0), switchMap(() => this.service.listJobs(this.courseId)))
      .subscribe((jobs) => this.onJobsRefreshed(jobs));
  }

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
  }

  onTypeChange(type: BulkImportType): void {
    this.selectedType.set(type);
    this.resetSelection();
  }

  downloadTemplate(): void {
    this.service.downloadTemplate(this.courseId, this.selectedType()).subscribe((response) => {
      const blob = response.body;
      if (!blob) return;
      const label = this.typeOptions.find((o) => o.value === this.selectedType())?.label ?? this.selectedType();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${label}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onFilesAdded(event: NgxDropzoneChangeEvent): void {
    const file = event.addedFiles[0];
    if (!file) return;
    this.selectedFile.set(file);
    this.report.set(null);
    this.validating.set(true);

    this.service
      .validate(this.courseId, this.selectedType(), file)
      .pipe(finalize(() => this.validating.set(false)))
      .subscribe({
        next: (report) => this.report.set(report),
        // The global HTTP error interceptor already toasts the backend's
        // actual message (e.g. "este curso no tiene ninguna sección
        // asociada…") - just reset so the dropzone is ready for another try.
        error: () => this.selectedFile.set(null),
      });
  }

  changeFile(): void {
    this.resetSelection();
  }

  confirmImport(): void {
    const file = this.selectedFile();
    if (!file) return;
    this.submitting.set(true);

    this.service
      .createJob(this.courseId, this.selectedType(), file)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (job) => {
          this.toaster.info('Importación en curso — te avisaremos cuando termine.', 'Importando', { timeOut: 4000 });
          this.previousStatuses.set(job.id, job.status);
          this.jobs.update((current) => [job, ...current]);
          this.resetSelection();
        },
        // Global HTTP error interceptor already toasts the backend's message.
      });
  }

  hasBlockingIssues(): boolean {
    return (this.report()?.validRows ?? 0) === 0;
  }

  typeLabel(type: BulkImportType): string {
    return this.typeOptions.find((o) => o.value === type)?.label ?? type;
  }

  private resetSelection(): void {
    this.selectedFile.set(null);
    this.report.set(null);
  }

  private onJobsRefreshed(jobs: IBulkImportJob[]): void {
    for (const job of jobs) {
      const previous = this.previousStatuses.get(job.id);
      const wasActive = previous === undefined || ACTIVE_STATUSES.includes(previous);
      const isTerminal = !ACTIVE_STATUSES.includes(job.status);

      if (previous && previous !== job.status && wasActive && isTerminal) {
        this.notifyJobFinished(job);
      }
      this.previousStatuses.set(job.id, job.status);
    }
    this.jobs.set(jobs);
  }

  private notifyJobFinished(job: IBulkImportJob): void {
    const label = this.typeLabel(job.type);
    if (job.status === 'COMPLETED') {
      this.toaster.success(`${job.importedRows} de ${job.totalRows} filas de ${label} importadas.`, 'Importación completada', {
        timeOut: 6000,
      });
    } else if (job.status === 'COMPLETED_WITH_ERRORS') {
      this.toaster.warning(
        `${job.importedRows} importadas, ${job.skippedRows} omitidas por errores.`,
        'Importación completada con avisos',
        { timeOut: 6000 },
      );
    } else if (job.status === 'FAILED') {
      this.toaster.error(`No se ha podido completar la importación de ${label}.`, 'Importación fallida', { timeOut: 6000 });
    }
  }
}