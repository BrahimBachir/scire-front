import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { QuestionService } from 'src/app/services';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { FeatureType, IQuestion, IAnswer } from 'src/app/common/models/interfaces';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    AppReactionsComponent,
    MatDividerModule
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit, OnChanges {
  private service = inject(QuestionService)
  featureType: FeatureType = 'QUESTION';
  @Input() ruleCode!: string;
  @Input() artiCode!: string;
  question = signal<IQuestion | null>(null);
  selectedAnswer: IAnswer;
  direction: string = 'FORWARD';

  ngOnInit(): void {
    this.getQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }

  
  answerQuestion(answer: IAnswer) {
    const q = this.question();
    if(q){
      q.answered = true; 
      answer.selected = true;
      q.isCorrect = answer.isCorrect;
      q.answers.forEach ((a) => {if(a.id !== answer.id)  a.selected = false; })
    }
  }

  getNext() {
    this.direction = 'FORWARD';
    this.getQuestion();
  }

  getPrevious() {
    this.direction = 'BACKWARD';
    this.getQuestion();
  }

  getQuestion() {
    console.log("Data to be sent: ",this.direction, this.question()?.id)
    this.service.navigate(this.ruleCode, this.artiCode, {questionId: this.question()?.id || 0, direction: this.direction}).subscribe({
      next: (data) => {
        console.log("Question from the server: ", data)
        this.question.set(data);
      },
      error: (error) => console.error(error)
    })
  }
}
