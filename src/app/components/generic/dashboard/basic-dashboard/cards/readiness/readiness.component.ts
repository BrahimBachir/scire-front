import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { IExamReadiness } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { BasicMetricsService } from 'src/app/services';

type ReadinessStatus = 'ok' | 'mid' | 'low';

interface ITestTypeMeta {
  subtitle: string;
  icon: string;
}

const TEST_TYPE_META: { match: string; meta: ITestTypeMeta }[] = [
  { match: 'temario', meta: { subtitle: 'Repaso de los temas ya estudiados', icon: 'book' } },
  { match: 'simulacro', meta: { subtitle: 'Condiciones idénticas al examen real', icon: 'alert-triangle' } },
  { match: 'concepto', meta: { subtitle: 'Comprobación de que los conceptos están claros', icon: 'bulb' } },
  { match: 'plazo', meta: { subtitle: 'Control de los plazos legales clave', icon: 'clock' } },
];

const DEFAULT_META: ITestTypeMeta = { subtitle: 'Puntuación media frente a la mínima para aprobar', icon: 'certificate' };

@Component({
  selector: 'app-bd-readiness',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
  ],
  templateUrl: './readiness.component.html',
  styleUrl: './readiness.component.scss',
})
export class AppBDReadinessComponent implements OnInit {
  private service = inject(BasicMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null =
    Number(this.route.snapshot.paramMap.get('courseId')) || null;

  readiness: IExamReadiness[] = [];

  ngOnInit(): void {
    this.loadReadiness();
  }

  loadReadiness() {
    this.loading = true;
    this.service
      .getReadiness(this.courseId ?? 0)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => this.readiness = res,
        error: (error) => console.error(error),
      });
  }

  meta(exerciseName: string): ITestTypeMeta {
    const normalized = (exerciseName ?? '').toLowerCase();
    return TEST_TYPE_META.find((entry) => normalized.includes(entry.match))?.meta ?? DEFAULT_META;
  }

  status(item: IExamReadiness): ReadinessStatus {
    if (item.isReady) return 'ok';
    const gap = item.all_strategy.needed_correc_percentage - item.all_strategy.user_correct_percentage;
    return gap <= 20 ? 'mid' : 'low';
  }

  statusLabel(status: ReadinessStatus): string {
    return { ok: 'Listo', mid: 'Casi listo', low: 'Lejos' }[status];
  }
}
