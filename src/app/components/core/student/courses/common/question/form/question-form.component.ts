import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatureFormComponent } from 'src/app/common/models/interfaces';
import { DifficultyFilterComponent } from 'src/app/components/generic/filters/difficulty/difficulty-filter.component';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-question-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DifficultyFilterComponent,
    MatFormFieldModule,
    MatCardModule,
    MaterialModule,
    MatExpansionModule,
    MatButtonModule,
    IconModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionFormComponent implements FeatureFormComponent {
  @Input({ required: true }) form!: FormGroup;

  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  onCorrectChange(index: number) {
    this.answers.controls.forEach((ctrl, i) => {
      if (i !== index) {
        ctrl.get('isCorrect')?.setValue(false, { emitEvent: false });
      }
    });
  }
}

/* export class AppQuestionCreateEditComponent implements OnInit, OnChanges {
  private service = inject(QuestionService)

  question = model<IQuestion | null>(null);
  @Input() rule = signal<IRule | null>(null);
  selectedArticlesIds = model<string[] | null>(null);
  difficulty = signal<IDifficulty | null>(null);
  dificultyMaxValue = signal<number | null>(null)


  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();


  questionForm = new FormGroup({
    id: new FormControl<number | null>(null),
    text: new FormControl('', Validators.required),
    explanation: new FormControl('', Validators.required),
    difficulty: new FormControl<number>(1, Validators.required),
    real: new FormControl(false, Validators.required),

    answers: new FormArray<FormGroup>([
      this.createAnswer(),
      this.createAnswer(),
      this.createAnswer(),
      this.createAnswer(),
    ],
        { validators: singleCorrectAnswerValidator }

  ),
  });

  createAnswer(): FormGroup {
    return new FormGroup({
      id: new FormControl<number | null>(null),
      text: new FormControl('', Validators.required),
      isCorrect: new FormControl(false, Validators.required),
    });
  }

onCorrectChange(index: number) {
  this.answers.controls.forEach((ctrl, i) => {
    if (i !== index) {
      ctrl.get('isCorrect')?.setValue(false, { emitEvent: false });
    }
  });
}

  ngOnInit(): void {
    const q = this.question();

    if (q) {
      this.dificultyMaxValue.set(q.difficulty)
      this.questionForm.patchValue({
        id: q.id,
        text: q.text,
        explanation: q.explanation,
        difficulty: q.difficulty,
        real: q.real
      });
      
      this.answers.clear();

      q.answers.forEach(a => {
        this.answers.push(
          new FormGroup({
            id: new FormControl(a.id),
            text: new FormControl(a.text, Validators.required),
            isCorrect: new FormControl(a.isCorrect),
          })
        );
      });
    }
  }

  get f() {
    return this.questionForm.controls;
  }

  get answers(): FormArray {
  return this.questionForm.get('answers') as FormArray;

  }

  save() {
    let q = this.question();
    const rule = this.rule();
    const ids = this.selectedArticlesIds();
    let newQ = cleanObject(this.questionForm.value) as IQuestion;
    if(q) newQ.id = q.id;
    const newAnswers = newQ.answers.map((an) => an = cleanObject(an) as IAnswer)
    newQ.answers = newAnswers;
    newQ.articles = ids || undefined;
    newQ.ruleId = rule?.id  || undefined;
    newQ.difficulty = this.difficulty()?.maxValue || 1;

    this.question.set(newQ)
    if (newQ.id) this.update();
    else this.create();
  }

  create() {
    const q = this.question();
    
    if(q) this.service.create(q).subscribe((saved => {
      this.question.set(saved);
      this.closeDialog.emit();
    }));
  }

  update() {
    const q = this.question();
    
    if(q) this.service.update(q).subscribe((saved => {
      this.question.set(saved);
      this.closeDialog.emit();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }
}
 */