import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Input, model, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatureFormComponent, IFlashcard, IRule } from 'src/app/common/models/interfaces';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FlashcardService } from 'src/app/services';
import { cleanObject } from 'src/app/common/utils';
@Component({
  selector: 'app-flashcard-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MaterialModule,
    MatExpansionModule,
    MatButtonModule,
    TablerIconsModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './flashcard-form.component.html',
  styleUrl: './flashcard-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class FlashcardFormComponent implements FeatureFormComponent {
  @Input({ required: true }) form!: FormGroup;

}
/* export class FlashcardFormComponent implements OnInit {
  private service = inject(FlashcardService)

  flashcard = model<IFlashcard | null>(null);
  @Input() rule = signal<IRule | null>(null);
  selectedArticlesIds = model<string[] | null>(null);
  
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  
  flashcardForm = new FormGroup({
    question: new FormControl<string>('', [Validators.required]),
    answer: new FormControl<string>('', [Validators.required])
    
  })

  ngOnInit(): void {
    const fc = this.flashcard();

    if(fc) {
      this.f.answer.setValue(fc?.answer);
      this.f.question.setValue(fc?.question);
      this.selectedArticlesIds.set(fc.articles ?? null);
    }
  }

  get f() {
    return this.flashcardForm.controls;
  }

  save(){
    let fc = this.flashcard();
    const rule = this.rule();
    const ids = this.selectedArticlesIds();
    fc = cleanObject(this.flashcardForm.value) as IFlashcard;
    fc.articles = ids || undefined;
    fc.ruleId = rule?.id  || undefined;
    this.flashcard.set(fc);

    if(fc.id) this.update();
    else this.create();
  }
  
  create() {
    let fc = this.flashcard();

    if(fc) this.service.create(fc).subscribe((saved => {
      this.closeDialog.emit();
    }));
  }

  update() {
    let fc = this.flashcard();

    if(fc) this.service.update(fc).subscribe((saved => {
      this.closeDialog.emit();
    }));
  }
}
 */