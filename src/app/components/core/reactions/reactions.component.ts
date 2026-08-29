import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactionsService } from 'src/app/services';
import { IRule, IDiagram, IFlashcard, IQuestion, FeatureType } from 'src/app/common/models/interfaces';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AppFeedbackDialogComponent } from './feedback/feedback-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
    selector: 'app-reactions',
    templateUrl: './reactions.component.html',
    imports: [
        CommonModule,
        MaterialModule,
        MatCardModule,
        IconModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class AppReactionsComponent /* implements OnInit */ {
    private reactService = inject(ReactionsService)
    private dialog = inject(MatDialog);

    @Input() content2: IDiagram | IRule | IFlashcard | IQuestion | null;
    @Input() content = signal<IDiagram | IRule | IFlashcard | IQuestion | null>(null);
    @Input() featureType: FeatureType;

    //protected user = signal<IUser | null>(null);
    protected userVote = signal<string>('');
    protected likeCount = signal<number>(0);
    protected dislikeCount = signal<number>(0);
    protected inModeration = signal<boolean>(false);
    protected blocked = signal<boolean>(false);


    contentChangeEffect = effect(() => {
        const currentContent = this.content(); // Reads the signal
        
        // Check if content exists and has an ID before fetching data
        if (currentContent && currentContent.id) {
            this.getUserVote();
            this.getVoteState();
        } else {
            // Optional: reset state if content is null/unset
            this.userVote.set('');
            this.likeCount.set(0);
            this.dislikeCount.set(0);
            this.inModeration.set(false);
            this.blocked.set(false);
        }
    });
    
    react(voteType: 'LIKE' | 'DISLIKE') {
        if (voteType === 'DISLIKE') {
            const dialogRef = this.dialog.open(AppFeedbackDialogComponent, {
                data: { action: voteType },
            });
            dialogRef.afterClosed().subscribe(res => {
                if (res.feedback) {
                    this.sendReaction(voteType, res.feedback);
                }
            });
        } else {
            this.sendReaction('LIKE');
        }
    }

    sendReaction(voteType: 'LIKE' | 'DISLIKE', feedbackText?: string) {
        const content = this.content();
        if (content !== null)
            this.reactService.processReaction(content, { voteType, featureType: this.featureType }, feedbackText)
                .subscribe(response => {
                    this.getUserVote();
                    this.getVoteState();
                });
    }

    getUserVote() {
        if (this.content) this.reactService.getMyVote({ featureId: this.content()?.id, featureType: this.featureType }
        ).subscribe(response => {
            this.userVote.set(response.voteType ?? '');
        });
    }

    getVoteState() {
        if (this.content) this.reactService.getVoteState({ featureId: this.content()?.id, featureType: this.featureType }
        ).subscribe(response => {
            this.likeCount.set(response.likeCount ?? 0);
            this.dislikeCount.set(response.dislikeCount ?? 0);
            this.inModeration.set(response.inModeration ?? false);
            this.blocked.set(response.blocked ?? false);
        });
    }
}
