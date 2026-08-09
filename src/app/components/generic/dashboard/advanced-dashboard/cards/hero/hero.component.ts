import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { IActivityTrend, IPassProbability } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AdvancedMetricsService } from 'src/app/services';

type Status = 'ok' | 'mid' | 'low';

@Component({
  selector: 'app-ad-hero',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class AppADHeroComponent implements OnInit {
  private service = inject(AdvancedMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  probability: IPassProbability;
  activity: IActivityTrend;

  readonly ringRadius = 22;
  readonly ringCircumference = 2 * Math.PI * this.ringRadius;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      probability: this.service.getPassProbability(this.courseId ?? 0),
      activity: this.service.getActivityTrend(this.courseId ?? 0),
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: ({ probability, activity }) => {
          this.probability = probability;
          this.activity = activity;
        },
        error: (error) => console.error(error)
      })
  }

  status(value: number): Status {
    if (value >= 80) return 'ok';
    if (value >= 60) return 'mid';
    return 'low';
  }

  get ringOffset(): number {
    const value = this.probability?.probability ?? 0;
    return this.ringCircumference - (this.ringCircumference * value) / 100;
  }

  get paceWidth(): number {
    if (!this.activity?.requiredPace) return 100;
    return Math.min(100, (this.activity.currentPace / this.activity.requiredPace) * 100);
  }
}
