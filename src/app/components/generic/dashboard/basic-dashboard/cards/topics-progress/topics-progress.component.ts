import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ICourseProgress, ITopicProgress } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { BasicMetricsService } from 'src/app/services';

type TopicStatus = 'done' | 'progress' | 'todo';

@Component({
  selector: 'app-bd-topics-progress',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule
  ],
  templateUrl: './topics-progress.component.html',
  styleUrl: './topics-progress.component.scss',
})
export class AppBDTopicsProgressComponent implements OnInit {
  private service = inject(BasicMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  topics: ICourseProgress;

  ngOnInit(): void {
    this.loadTopicsProgress();
  }

  loadTopicsProgress() {
    this.loading = true;
    this.service.getTopicsProgress(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (topics) => this.topics = topics,
        error: (error) => console.error(error)
      })
  }

  get progress(): ITopicProgress[] {
    return this.topics?.topics ?? [];
  }

  status(pct: number): TopicStatus {
    if (pct >= 100) return 'done';
    if (pct > 0) return 'progress';
    return 'todo';
  }

  barClass(pct: number): string {
    return { done: 'mat-success', progress: 'mat-warning', todo: 'mat-error' }[this.status(pct)];
  }
}
