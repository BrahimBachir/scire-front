import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewChild,
  viewChildren,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TestService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FeatureType,
  IAnswer,
  IQuestion,
  ITest,
  ITestQuestion,
} from 'src/app/common/models/interfaces';
import { CountdownTimer } from './countdown-timer/countdown-timer';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AppReactionsComponent } from '../../../reactions/reactions.component';
import { MatSliderModule } from '@angular/material/slider';
import { TestStrategy } from 'src/app/strategies/test.strategy';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-test-simulator',
  imports: [
    MatDialogModule,
    MatButtonModule,
    CountdownTimer,
    CommonModule,
    NgScrollbarModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    AppReactionsComponent,
    MatSliderModule,
  ],
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.scss',
  providers: [TestStrategy],
})
export class AppTestSimulatorComponent implements OnInit, OnDestroy {
  @ViewChild(CountdownTimer) countdownTimerComponent!: CountdownTimer;
  private service = inject(TestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private strategy = inject(TestStrategy);
  private breakpointObserver = inject(BreakpointObserver);
  isOverSignal = signal(window.matchMedia('(max-width: 960px)').matches);
  private breakpointSubscription = this.breakpointObserver
    .observe('(max-width: 960px)')
    .subscribe((state) => this.isOverSignal.set(state.matches));

  explanationElement = viewChild<ElementRef>('explanationSection');
  questionItems = viewChildren<ElementRef>('questionItems');

  testOngoing = signal(false);

  loading = false;
  error: string | null = null;

  sidePanelOpened = signal(true);
  featureType: FeatureType = 'QUESTION';

  testId = Number(this.route.snapshot.paramMap.get('testId')) || null;
  courseId = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  selectedTestQuestion = signal<ITestQuestion | null>(null);
  selectedQuestion = signal<IQuestion | null>(null);

  test!: ITest;
  selectedIndex: number = 0;

  // Remaining/consumed time as loaded from the backend, fixed for the
  // lifetime of this session. calculateTime() computes against these instead
  // of the repeatedly-reassigned `test.time_allowed`/`time_consumed`, which
  // would otherwise double-count already-persisted time on every save.
  private baselineTimeAllowed: number | null = null;
  private baselineTimeConsumed: number = 0;

  constructor() {
    effect(() => {
      const el = this.explanationElement();
      if (el) {
        el.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    });

    effect(() => {
      // Runs whenever selectedTestQuestion changes
      const selectedId = this.selectedQuestion()?.id;

      // Find the specific DOM element that matches the selected ID
      const elementToScroll = this.questionItems().find((item) =>
        item.nativeElement.classList.contains('active-question'),
      );

      if (elementToScroll) {
        elementToScroll.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadItem();
  }

  answerQuestion(answer: IAnswer): void {
    if (this.test.test_questions) {
      this.selectedTestQuestion.update((current) => {
        if (!current) return current;
        return {
          ...current,
          answered: true,
          selectedAnswer: answer,
          correct: !!answer.isCorrect,
          postponed: false,
        };
      });

      this.submitTestQuestion();
    }
  }

  markForReview() {
    this.selectedTestQuestion.update((current) => {
      if (!current) return current;
      return {
        ...current,
        postponed: true,
      };
    });
    this.submitTestQuestion();
  }

  finishTest() {
    if (this.countdownTimerComponent.isTimerRunning)
      this.countdownTimerComponent.pauseTimer();
    this.test = {
      ...this.test,
      completed: true,
    };
    this.testOngoing.set(false);
    this.calculateTime();
    this.submitTest();
  }

  resetTest() {
    this.service.reset(this.test.id).subscribe({
      next: (result) => {
        this.test = result;
        this.baselineTimeAllowed = result.time_allowed ?? null;
        this.baselineTimeConsumed = result.time_consumed ?? 0;
        this.countdownTimerComponent?.setRemainingSeconds(
          result.time_allowed ?? 0,
        );
        this.onSliderChange(this.selectedIndex);
      },
      error: () => (this.error = 'Error al reiniciar el examen'),
    });
  }

  routeToTestsDetails() {
    this.router.navigate([
      `${this.route.snapshot.data['role'].toLowerCase()}/courses/${this.courseId}/tests/${this.test.id}/results`,
    ]);
  }

  startTest() {
    if (
      this.countdownTimerComponent &&
      !this.countdownTimerComponent.isTimerRunning
    ) {
      this.countdownTimerComponent.startTimer();
      this.testOngoing.set(true);
      let tq =
        this.test_questions.find((q) => !q.answered) ?? this.test_questions[0];
      this.selectedIndex = this.test_questions.indexOf(tq);
    }
    this.onSliderChange(this.selectedIndex);
  }

  pauseTest() {
    if (
      this.countdownTimerComponent &&
      this.countdownTimerComponent.isTimerRunning
    )
      this.countdownTimerComponent.pauseTimer();
    this.testOngoing.set(false);
    this.calculateTime();
    this.submitTest();
  }

  submitTest() {
    this.loading = true;
    this.error = null;

    const test = {
      id: this.test.id,
      num_questions: this.test.num_questions,
      timed: this.test.timed,
      creatorId: this.test.creatorId,
      courseId: this.test.courseId,
      time_allowed: this.test.time_allowed,
      time_consumed: this.test.time_consumed,
      completed: this.test.completed,
    };

    this.service
      .update(test)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.test = result;
          this.onSliderChange(this.selectedIndex);
          if (this.test.completed) {
            this.routeToTestsDetails();
          }
        },
        error: () => (this.error = 'Error al guardar el examen'),
      });
  }

  submitTestQuestion() {
    this.loading = true;
    this.error = null;

    const question = {
      id: this.selectedTestQuestion()?.id,
      testId: this.selectedTestQuestion()?.testId,
      questionId: this.selectedTestQuestion()?.questionId,
      answered: this.selectedTestQuestion()?.answered,
      correct: this.selectedTestQuestion()?.correct,
      selectedAnswer: this.selectedTestQuestion()?.selectedAnswer,
      postponed: this.selectedTestQuestion()?.postponed,
    };

    this.service
      .updateTestQuestion(question as ITestQuestion)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.calculateTime();
          this.submitTest();
        },
        error: () => (this.error = 'Error al guardar la respuesta'),
      });
  }

  loadItem() {
    this.service.getOne(this.testId ?? 0).subscribe({
      next: (test) => {
        this.test = test;
        this.baselineTimeAllowed = test.time_allowed ?? null;
        this.baselineTimeConsumed = test.time_consumed ?? 0;
      },
      error: (error) => console.error(error),
    });
  }

  onSliderChange(event: any) {
    if (!this.testOngoing()) return;
    this.selectedIndex = event;

    const tq = this.test_questions[this.selectedIndex];
    tq.question = this.shuffleAnswers(tq.question);

    if (tq.answered) {
      this.countdownTimerComponent.pauseTimer();
    } else {
      this.countdownTimerComponent.startTimer();
    }

    this.selectedTestQuestion.set(tq);
    this.selectedQuestion.set(tq.question);

    if (!tq.visited) {
      tq.visited = true;
      this.service.visitTestQuestion(tq).subscribe({
        error: () => (tq.visited = false),
      });
    }
  }

  onSelect(tq: ITestQuestion): void {
    if (!this.countdownTimerComponent.isTimerRunning) return;
    this.selectedIndex = this.test_questions.indexOf(tq);
    this.onSliderChange(this.selectedIndex);
  }

  isOver(): boolean {
    return this.isOverSignal();
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }

  nextQuestion(): void {
    const tq = this.selectedTestQuestion();
    const index = tq ? this.test_questions.indexOf(tq) : -1;

    if (index < this.test_questions.length) {
      this.selectedIndex = index + 1;
    }

    if (index === this.test_questions.length - 1) this.finishTest();

    this.onSliderChange(this.selectedIndex);
  }

  previousQuestion() {
    const tq = this.selectedTestQuestion();
    const index = tq ? this.test_questions.indexOf(tq) : -1;

    if (index >= 0) this.selectedIndex = index - 1;

    this.onSliderChange(this.selectedIndex);
  }

  calculateTime() {
    const consumed = this.countdownTimerComponent.getConsumedTime();

    const time_allowed =
      this.baselineTimeAllowed != null
        ? this.baselineTimeAllowed - consumed
        : this.test.time_allowed;
    const time_consumed = this.baselineTimeConsumed + consumed;

    this.test = {
      ...this.test,
      time_allowed,
      time_consumed,
    };
  }

  nextUnansweredQuestion() {
    const tq = this.selectedTestQuestion();
    this.selectedIndex = tq ? this.test_questions.indexOf(tq) : -1;

    for (
      let index = this.selectedIndex;
      index < this.test_questions.length;
      index++
    ) {
      if (!this.test_questions[index].answered) {
        this.selectedIndex = index;
        this.onSliderChange(this.selectedIndex);
        break;
      }
    }
  }

  previousUnansweredQuestion() {
    const tq = this.selectedTestQuestion();
    this.selectedIndex = tq ? this.test_questions.indexOf(tq) : -1;

    for (let index = this.selectedIndex - 1; index >= 0; index--) {
      if (!this.test_questions[index].answered) {
        this.selectedIndex = index;
        this.onSliderChange(this.selectedIndex);
        break;
      }
    }
  }

  private shuffleAnswers(question: IQuestion): IQuestion {
    const shuffled = [...question.answers].sort(() => Math.random() - 0.5);
    return { ...question, answers: shuffled };
  }

  get test_questions(): ITestQuestion[] {
    return this.test?.test_questions ?? [];
  }
}
