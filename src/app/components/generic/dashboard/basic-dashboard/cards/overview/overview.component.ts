import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ICourseMetrics, IExamReadiness } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { BasicMetricsService } from 'src/app/services';

type ReadinessStatus = 'ok' | 'mid' | 'low';

@Component({
  selector: 'app-bd-overview',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class AppBDOverviewComponent implements OnInit {
  private service = inject(BasicMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  item: ICourseMetrics;
  readiness: IExamReadiness[] = [];

  readonly ringRadius = 24;
  readonly ringCircumference = 2 * Math.PI * this.ringRadius;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      overview: this.service.getOverviewMetrics(this.courseId ?? 0),
      readiness: this.service.getReadiness(this.courseId ?? 0),
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: ({ overview, readiness }) => {
          this.item = overview;
          this.readiness = readiness;
        },
        error: (error) => console.error(error)
      })
  }

  get ringOffset(): number {
    const progress = this.item?.progress ?? 0;
    return this.ringCircumference - (this.ringCircumference * progress) / 100;
  }

  get readyCount(): number {
    return this.readiness.filter((r) => r.isReady).length;
  }

  get readinessStatus(): ReadinessStatus {
    if (!this.readiness.length) return 'mid';
    if (this.readyCount === this.readiness.length) return 'ok';
    if (this.readyCount === 0) return 'low';
    return 'mid';
  }

  get readinessLabel(): string {
    return { ok: 'Listo', mid: 'Casi listo', low: 'Lejos' }[this.readinessStatus];
  }
}
