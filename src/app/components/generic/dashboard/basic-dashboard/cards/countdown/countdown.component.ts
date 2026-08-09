import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ICourseProgress, IExamReadiness, ITopicProgress } from 'src/app/common/models/interfaces';
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

  countdown: any[];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getReadiness(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          // TODO: bind res (IExamReadiness) to the template - neither `progress`
          // nor a readiness field exist on this component yet.
        },
        error: (error) => console.error(error)
      })

  }
}
