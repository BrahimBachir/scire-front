import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FEEDBACK_FEATURE_TYPES, IFeedback, IFeedbackAttachment, IFeedbackType } from 'src/app/common/models/interfaces';
import { FeatureType } from 'src/app/common/models/interfaces/feature-types';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { FeedbackService } from 'src/app/services';

@Component({
  selector: 'app-feedback-list',
  imports: [CommonModule, MaterialModule, IconModule, AppBannersNotFoundComponent],
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.scss',
})
export class AppFeedbackListComponent implements OnInit {
  private service = inject(FeedbackService);

  feedbacks = signal<IFeedback[] | null>(null);
  feedbackTypes = signal<IFeedbackType[]>([]);
  featureTypes = FEEDBACK_FEATURE_TYPES;
  featureTypeFilter: FeatureType | null = null;
  feedbackTypeFilter: number | null = null;
  displayedColumns = ['user', 'target', 'feedbackType', 'text', 'attachments', 'createdAt'];

  ngOnInit(): void {
    this.service.getTypes().subscribe((types) => this.feedbackTypes.set(types));
    this.getItems();
  }

  getItems(): void {
    this.feedbacks.set(null);
    this.service
      .list({
        featureType: this.featureTypeFilter ?? undefined,
        feedbackTypeId: this.feedbackTypeFilter ?? undefined,
      })
      .subscribe((res) => this.feedbacks.set(res.rows));
  }

  viewAttachment(attachment: IFeedbackAttachment): void {
    this.service.downloadAttachment(attachment.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    });
  }

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').trim();
  }
}
