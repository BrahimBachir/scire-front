import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ICourseMetrics, IExamReadiness } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { BasicMetricsService } from 'src/app/services';

@Component({
  selector: 'app-bd-countdown',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule
  ],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss',
})
export class AppBDCountdownComponent implements OnInit {
  private service = inject(BasicMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  overview: ICourseMetrics | null = null;
  readiness: IExamReadiness[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    // getOverviewMetrics feeds the "days to exam" countdown, getReadiness feeds the
    // per-exercise pass-strategy breakdown.
    forkJoin({
      overview: this.service.getOverviewMetrics(this.courseId ?? 0),
      readiness: this.service.getReadiness(this.courseId ?? 0),
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: ({ overview, readiness }) => {
          this.overview = overview;
          this.readiness = readiness;
        },
        error: (error) => console.error(error),
      });
  }
}
