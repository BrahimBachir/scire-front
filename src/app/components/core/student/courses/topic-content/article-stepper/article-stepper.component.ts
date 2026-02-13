import { Component, ChangeDetectionStrategy, Input, effect, Output, EventEmitter, model, signal, output } from "@angular/core";
import { MatStepperModule } from "@angular/material/stepper";
import { IParagraph, IArticleProgress } from "src/app/common/models/interfaces";
import { ArticleProgressFacade } from "src/app/services";
import { FlashcardNavigationComponent } from "../../common/flashcard/navigation/flashcard-navigation.component";
import { QuestionComponent } from "../../common/question/question.component";
import { VideoComponent } from "../../common/video/display/video.component";
import { ArticleContentComponent } from "../article-content/article-content.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { DiagramNavigationComponent } from "../../common/diagram/navigation/diagram-navigation.component";

@Component({
    selector: 'app-article-stepper',
    templateUrl: './article-stepper.component.html',
    imports: [
        CommonModule,
        MatStepperModule,
        VideoComponent,
        QuestionComponent,
        DiagramNavigationComponent,
        FlashcardNavigationComponent,
        ArticleContentComponent,
        MatButtonModule,
        MatIconModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleStepperComponent {
    @Input() paragraphs: IParagraph[] | null = null;
    @Input() ruleId!: number;
    @Input() articleId!: number;
    @Input() progress!: ArticleProgressFacade;
    @Input() lastArticle: boolean = false;

    @Output() resetRequested = new EventEmitter<void>();
    @Output() nextArticleRequested = new EventEmitter<void>();
    entityToCreate = output<string>();


    currentStepIndex = 0;
    stepSelectedTrigger: boolean = false;

    private readonly stepFields: (keyof IArticleProgress)[] = [
        'text_reviewed',
        'video_reviewed',
        'diagrams_reviewed',
        'flashcards_reviewed',
        'questions_reviewed'
    ];

    readonly STEP_MAP: Record<string, keyof IArticleProgress> = {
        text: 'text_reviewed',
        videos: 'video_reviewed',
        diagrams: 'diagrams_reviewed',
        flashcards: 'flashcards_reviewed',
        questions: 'questions_reviewed',
    };

    constructor() {
        effect(() => {
            const p = this.progress?.selectedArticleProgress();
            if (!p) return;
            if (this.stepSelectedTrigger) {
                this.stepSelectedTrigger = false;
                return;
            }

            const firstIncomplete = this.stepFields.findIndex(
                field => p[field] === false
            );

            this.currentStepIndex =
                firstIncomplete === -1
                    ? this.stepFields.length
                    : firstIncomplete;
        });
    }

    ngOnDestroy() {
        this.resetStepper();
    }

    resetStepper() {
        this.currentStepIndex = 0;
        this.resetRequested.emit();
    }

    goNextArticle() {
        this.nextArticleRequested.emit();
    }

    onStepChange(event: any) {
        this.stepSelectedTrigger = true;
        const label = event.previouslySelectedStep?.label;
        const field = this.STEP_MAP[label];
        if (field) {
            this.progress.markStepCompleted(field);
        }
        this.currentStepIndex = event.selectedIndex;
    }

    handleEntityCreationOutput(value: string) {
        this.entityToCreate.emit(value);
    }
}
