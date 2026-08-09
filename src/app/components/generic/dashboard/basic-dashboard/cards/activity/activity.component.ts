import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { IProgressActivity, IUserActivity } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { BasicMetricsService } from 'src/app/services';

interface IReviewEntry {
  label: string;
  icon: string;
  colorClass: string;
  reviewedAt: Date;
}

@Component({
  selector: 'app-bd-activity',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class AppBDActivityComponent implements OnInit {
  private service = inject(BasicMetricsService);
  private route = inject(ActivatedRoute);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  item: IUserActivity;

  ngOnInit(): void {
    this.loadItem();
  }

  loadItem() {
    this.loading = true;
    this.service.getActivity(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (item) => this.item = item,
        error: (error) => console.error(error)
      })
  }

  get last(): IProgressActivity | undefined {
    return this.item?.previous_activity ?? undefined;
  }

  get reviewedEntries(): IReviewEntry[] {
    const last = this.last;
    if (!last) return [];

    const entries: IReviewEntry[] = [
      { label: 'Texto revisado', icon: 'file', colorClass: 'success', reviewedAt: last.text_reviewed_at },
      { label: 'Vídeo revisado', icon: 'video', colorClass: 'error', reviewedAt: last.video_reviewed_at },
      { label: 'Diagramas revisados', icon: 'schema', colorClass: 'secondary', reviewedAt: last.diagrams_reviewed_at },
      { label: 'Flashcards revisadas', icon: 'flip-vertical', colorClass: 'warning', reviewedAt: last.flashcards_reviewed_at },
      { label: 'Preguntas revisadas', icon: 'help-circle', colorClass: 'primary', reviewedAt: last.questions_reviewed_at },
    ];

    return entries
      .filter((entry) => !!entry.reviewedAt)
      .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
  }
}
