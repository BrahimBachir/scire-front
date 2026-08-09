import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { IActivityTrend, IDailyActivityPoint } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AdvancedMetricsService } from 'src/app/services';

interface IChartPoint {
  x: number;
  y: number;
  count: number;
  date: string;
}

const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const PLOT_LEFT = 20;
const PLOT_RIGHT = 620;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 170;

@Component({
  selector: 'app-ad-activity-chart',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
  ],
  templateUrl: './activity-chart.component.html',
  styleUrl: './activity-chart.component.scss',
})
export class AppADActivityChartComponent implements OnInit {
  private service = inject(AdvancedMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  activity: IActivityTrend;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getActivityTrend(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (activity) => this.activity = activity,
        error: (error) => console.error(error)
      })
  }

  dayLetter(date: string): string {
    return DAY_LETTERS[new Date(`${date}T00:00:00`).getDay()];
  }

  private get maxValue(): number {
    const days = this.activity?.daily ?? [];
    const max = Math.max(...days.map((d) => d.count), this.activity?.requiredPace ?? 0, 1);
    return max;
  }

  get points(): IChartPoint[] {
    const days: IDailyActivityPoint[] = this.activity?.daily ?? [];
    const n = days.length;
    if (!n) return [];
    const step = n > 1 ? (PLOT_RIGHT - PLOT_LEFT) / (n - 1) : 0;
    const max = this.maxValue;
    return days.map((d, i) => ({
      x: PLOT_LEFT + i * step,
      y: PLOT_BOTTOM - (d.count / max) * (PLOT_BOTTOM - PLOT_TOP),
      count: d.count,
      date: d.date,
    }));
  }

  get linePath(): string {
    return this.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
  }

  get areaPath(): string {
    const pts = this.points;
    if (!pts.length) return '';
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `${this.linePath} L${last.x.toFixed(1)},${PLOT_BOTTOM} L${first.x.toFixed(1)},${PLOT_BOTTOM} Z`;
  }

  get targetY(): number {
    return PLOT_BOTTOM - ((this.activity?.requiredPace ?? 0) / this.maxValue) * (PLOT_BOTTOM - PLOT_TOP);
  }

  get lastPoint(): IChartPoint | undefined {
    const pts = this.points;
    return pts[pts.length - 1];
  }

  get labeledPoints(): IChartPoint[] {
    return this.points.filter((_, i) => i % 2 === 0);
  }

  get streakDays(): { on: boolean; letter: string }[] {
    const last7 = (this.activity?.daily ?? []).slice(-7);
    const streak = this.activity?.streak ?? [];
    return last7.map((d, i) => ({ on: !!streak[i], letter: this.dayLetter(d.date) }));
  }
}
