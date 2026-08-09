import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { IWeakSpotRow, IWeakSpots } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AdvancedMetricsService } from 'src/app/services';

type Status = 'ok' | 'mid' | 'low';

const TEST_TYPE_ORDER = ['SYLLABUS', 'MOCK', 'CONCEPTS', 'DEADLINES', 'REAL', 'DEFINITIONS'];

const TEST_TYPE_LABEL: Record<string, string> = {
  SYLLABUS: 'Temario',
  MOCK: 'Simulacro',
  CONCEPTS: 'Conceptos',
  DEADLINES: 'Plazos',
  REAL: 'Examen real',
  DEFINITIONS: 'Definiciones',
};

@Component({
  selector: 'app-ad-weak-spots',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
  ],
  templateUrl: './weak-spots.component.html',
  styleUrl: './weak-spots.component.scss',
})
export class AppADWeakSpotsComponent implements OnInit {
  private service = inject(AdvancedMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  weakSpots: IWeakSpots;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getWeakSpots(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (weakSpots) => this.weakSpots = weakSpots,
        error: (error) => console.error(error)
      })
  }

  get columns(): string[] {
    const codes = new Set<string>();
    for (const row of this.weakSpots?.rows ?? []) {
      for (const cell of row.cells) codes.add(cell.typeCode);
    }
    return Array.from(codes).sort(
      (a, b) => TEST_TYPE_ORDER.indexOf(a) - TEST_TYPE_ORDER.indexOf(b),
    );
  }

  columnLabel(typeCode: string): string {
    return TEST_TYPE_LABEL[typeCode] ?? typeCode;
  }

  cellAccuracy(row: IWeakSpotRow, typeCode: string): number | null {
    return row.cells.find((c) => c.typeCode === typeCode)?.accuracy ?? null;
  }

  status(value: number | null): Status {
    if (value === null) return 'mid';
    if (value >= 80) return 'ok';
    if (value >= 60) return 'mid';
    return 'low';
  }
}
