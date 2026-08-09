import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { IProgressActivity, IUserActivity } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { BasicMetricsService } from 'src/app/services';

@Component({
  selector: 'app-bd-next-up',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
  ],
  templateUrl: './next-up.component.html',
  styleUrl: './next-up.component.scss',
})
export class AppBDNextUpComponent implements OnInit {
  private service = inject(BasicMetricsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading: boolean = false;
  error: string | null = null;

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  item: IUserActivity;
  next: IProgressActivity | undefined;

  ngOnInit(): void {
    this.loadItem();
  }

  loadItem() {
    this.loading = true;
    this.service.getActivity(this.courseId ?? 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (item) => {
          this.item = item;
          this.next = item?.upcoming_activity ?? undefined;
        },
        error: (error) => console.error(error)
      })
  }

  goToTopic(topicId: number) {
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topic/:topicId/content`
        .replace(':courseId', this.courseId?.toString() || '0')
        .replace(':topicId', topicId.toString()),
    ]);
  }
}
