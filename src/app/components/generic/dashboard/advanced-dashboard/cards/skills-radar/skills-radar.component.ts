import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ISkillPoint, ISkillsRadar } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AdvancedMetricsService } from 'src/app/services';

interface IAxisLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface IRadarLabel {
  x: number;
  y: number;
  anchor: string;
  text: string;
}

interface IPoint {
  x: number;
  y: number;
}

const CENTER = 100;
const MAX_RADIUS = 80;
const MIN_TOPICS_FOR_RADAR = 3;

@Component({
  selector: 'app-ad-skills-radar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
  ],
  templateUrl: './skills-radar.component.html',
  styleUrl: './skills-radar.component.scss',
})
export class AppADSkillsRadarComponent implements OnInit {
  private service = inject(AdvancedMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  radar: ISkillsRadar;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getSkillsRadar(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (radar) => this.radar = radar,
        error: (error) => console.error(error)
      })
  }

  get topics(): ISkillPoint[] {
    return this.radar?.topics ?? [];
  }

  get hasEnoughData(): boolean {
    return this.topics.length >= MIN_TOPICS_FOR_RADAR;
  }

  private angleFor(index: number): number {
    const n = this.topics.length;
    return -Math.PI / 2 + (index * 2 * Math.PI) / n;
  }

  private pointAt(index: number, radiusRatio: number): IPoint {
    const angle = this.angleFor(index);
    const r = radiusRatio * MAX_RADIUS;
    return {
      x: Math.round((CENTER + r * Math.cos(angle)) * 10) / 10,
      y: Math.round((CENTER + r * Math.sin(angle)) * 10) / 10,
    };
  }

  guideRing(ratio: number): string {
    return this.topics
      .map((_, i) => {
        const p = this.pointAt(i, ratio);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  }

  get axisLines(): IAxisLine[] {
    return this.topics.map((_, i) => {
      const p = this.pointAt(i, 1);
      return { x1: CENTER, y1: CENTER, x2: p.x, y2: p.y };
    });
  }

  get shapePoints(): string {
    return this.topics
      .map((t, i) => {
        const p = this.pointAt(i, Math.max(0.04, t.accuracy / 100));
        return `${p.x},${p.y}`;
      })
      .join(' ');
  }

  get dots(): IPoint[] {
    return this.topics.map((t, i) => this.pointAt(i, Math.max(0.04, t.accuracy / 100)));
  }

  get labels(): IRadarLabel[] {
    return this.topics.map((t, i) => {
      const p = this.pointAt(i, 1.16);
      let anchor = 'middle';
      if (p.x < CENTER - 8) anchor = 'end';
      else if (p.x > CENTER + 8) anchor = 'start';
      return { x: p.x, y: p.y, anchor, text: this.shortLabel(t.topicName) };
    });
  }

  private shortLabel(text: string): string {
    return text.length > 16 ? `${text.slice(0, 15)}…` : text;
  }
}
