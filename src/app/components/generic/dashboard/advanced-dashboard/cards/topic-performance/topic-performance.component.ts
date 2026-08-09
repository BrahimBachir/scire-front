import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ITopicPerformance } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AdvancedMetricsService } from 'src/app/services';

@Component({
  selector: 'app-ad-topic-performance',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
  ],
  templateUrl: './topic-performance.component.html',
  styleUrl: './topic-performance.component.scss',
})
export class AppADTopicPerformanceComponent implements OnInit {
  private service = inject(AdvancedMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  topics: ITopicPerformance[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getTopicPerformance(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (topics) => this.topics = topics,
        error: (error) => console.error(error)
      })
  }
}
