import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { QuestionService } from 'src/app/services';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { FeatureType, IRule, IArticle, IQuestion } from 'src/app/common/models/interfaces';

@Component({
  selector: 'app-ai-element-create',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    MatDividerModule
  ],
  templateUrl: './ai-element-create.component.html',
  styleUrl: './ai-element-create.component.scss'
})
export class AppQuestionCreateEditComponent {
  private service = inject(QuestionService)
  featureType: FeatureType = 'QUESTION';

  @Input() rule!: IRule;
  @Input() article!: IArticle;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  
  question = signal<IQuestion | null>(null);

  setElementSelected(element: any) {
    console.log(element.value)
  }


  onChipSelection(event: MatChipSelectionChange) {
    console.log(event.source.value)
    const selectedValue = event;

/*     switch (selectedValue) {
      case 'question':
        this.handleQuestion();
        break;
      case 'diagram':
        this.handleDiagram();
        break;
      case 'flashcard':
        this.handleFlashcard();
        break;
    } */
  }

  handleQuestion() {
    console.log('Question selected');
  }

  handleDiagram() {
    console.log('Diagram selected');
  }

  handleFlashcard() {
    console.log('Flashcard selected');
  }

}
