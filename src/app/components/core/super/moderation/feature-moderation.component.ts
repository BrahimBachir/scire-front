import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import {
  DiagramService,
  FlashcardService,
  ModerationService,
  QuestionService,
  VideoService,
} from 'src/app/services';
import { IDiagram, IFlashcard, IModerationQueueItem, IQuestion, IVideo, ModeratableFeatureType } from 'src/app/common/models/interfaces';
import { Observable } from 'rxjs';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';
import { CreateGenericElementDialogComponent } from 'src/app/components/core/student/courses/common/create-generic-element/create-generic-element-dialog/create-generic-element-dialog.component';
import { ModerationConfirmDialogComponent } from './confirm-dialog/moderation-confirm-dialog.component';
import { ModerationReactionsDialogComponent } from './reactions-dialog/moderation-reactions-dialog.component';

const FEATURE_TYPE_LABELS: Record<ModeratableFeatureType, string> = {
  QUESTION: 'Pregunta',
  VIDEO: 'Vídeo',
  DIAGRAM: 'Diagrama',
  FLASHCARD: 'Flashcard',
};

@Component({
  selector: 'app-feature-moderation',
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressSpinnerModule,
    AppBannersNotFoundComponent,
  ],
  templateUrl: './feature-moderation.component.html',
})
export class AppFeatureModerationComponent implements OnInit {
  private service = inject(ModerationService);
  private questionService = inject(QuestionService);
  private videoService = inject(VideoService);
  private diagramService = inject(DiagramService);
  private flashcardService = inject(FlashcardService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  protected readonly displayedColumns = ['type', 'summary', 'creator', 'dislikes', 'actions'];
  protected items: IModerationQueueItem[] | null = null;
  protected processingId: number | null = null;

  featureTypeLabel(type: ModeratableFeatureType): string {
    return FEATURE_TYPE_LABELS[type] ?? type;
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.items = null;
    this.service.getFeatureQueue().subscribe((items) => (this.items = items));
  }

  editAndRepublish(item: IModerationQueueItem): void {
    const type = item.featureType as ModeratableFeatureType;
    this.processingId = item.id;
    this.fetchFullItem(type, item.id).subscribe({
      next: (element) => {
        this.processingId = null;
        const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
          width: '900px',
          data: {
            action: 'EDITAR',
            mode: 'EDITING',
            feature: type,
            rule: (element as any)?.rule,
            ruleId: (element as any)?.ruleId,
            articlesIds: (element as any)?.articlesIds || [],
            element,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;
          this.service.resolve(type, item.id).subscribe({
            next: () => {
              this.showSnackbar('Elemento corregido y republicado.');
              this.getItems();
            },
          });
        });
      },
      error: () => (this.processingId = null),
    });
  }

  private fetchFullItem(type: ModeratableFeatureType, id: number): Observable<IQuestion | IVideo | IDiagram | IFlashcard> {
    switch (type) {
      case 'QUESTION': return this.questionService.getOne(id);
      case 'VIDEO': return this.videoService.getOne(id);
      case 'DIAGRAM': return this.diagramService.getOne(id);
      case 'FLASHCARD': return this.flashcardService.getOne(id);
    }
  }

  markAsCorrect(item: IModerationQueueItem): void {
    const dialogRef = this.dialog.open(ModerationConfirmDialogComponent, {
      data: {
        title: 'Marcar como correcto',
        message: 'La moderación de la comunidad se considerará incorrecta y el elemento saldrá de la cola de moderación. ¿Continuar?',
        confirmLabel: 'Marcar como correcto',
        confirmColor: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.processingId = item.id;
      this.service.resolve(item.featureType as ModeratableFeatureType, item.id).subscribe({
        next: () => {
          this.processingId = null;
          this.showSnackbar('Elemento marcado como correcto.');
          this.getItems();
        },
        error: () => (this.processingId = null),
      });
    });
  }

  showReactions(item: IModerationQueueItem): void {
    const dialogRef = this.dialog.open(ModerationReactionsDialogComponent, {
      width: '600px',
      data: { summary: item.summary, reactions: item.reactions },
    });

    // Reviewing comments from the carousel doesn't require re-deciding the
    // item, but it can change its dislike count (or pull it out of the
    // queue entirely), so refresh once the moderator is done reading.
    dialogRef.afterClosed().subscribe(() => this.getItems());
  }

  discard(item: IModerationQueueItem): void {
    const dialogRef = this.dialog.open(ModerationConfirmDialogComponent, {
      data: {
        title: 'Descartar elemento',
        message: `Se bloqueará este elemento y se notificará por correo a ${item.creator?.name ?? 'su autor'}. ¿Continuar?`,
        confirmLabel: 'Descartar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.processingId = item.id;
      this.service.discard(item.featureType as ModeratableFeatureType, item.id).subscribe({
        next: () => {
          this.processingId = null;
          this.showSnackbar('Elemento descartado.');
          this.getItems();
        },
        error: () => (this.processingId = null),
      });
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
