import { Component, effect, inject, Input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { QuestionService } from 'src/app/services';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { FeatureType, IQuestion, IAnswer, IncomingNavigableEntity } from 'src/app/common/models/interfaces';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';
import { MyOwnElementPipe } from 'src/app/common/pipe/my-own-element.pipe';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { CreateGenericElementDialogComponent } from '../create-generic-element/create-generic-element-dialog/create-generic-element-dialog.component';
import { AppElementNavigationComponent } from '../element-navigation/element-navigation.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatDividerModule,
    MyOwnElementPipe,
    AppElementNavigationComponent,
    MatTooltipModule
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit, OnChanges {
  private service = inject(QuestionService)
  private snackBar = inject(MatSnackBar)
  private dialog = inject(MatDialog)

  featureType: FeatureType = 'QUESTION';
  @Input() ruleId!: number;
  @Input() articleId!: number;
  question = signal<IQuestion | null>(null);
  selectedAnswer: IAnswer;
  entityToCreate = output<string>();

  navigationState: IncomingNavigableEntity = {
    item: { id: 0},
    hasNext: false,
    hasPrevious: false,
  };

  ngOnInit(): void {
    this.goNext()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", this.question());
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

  goNext() {
    this.service.navigate(this.articleId, { questionId: this.navigationState.nextId! })
      .subscribe(res => {
        this.question.set(res.item as IQuestion);
        this.navigationState = res;
        console.log("Question",this.question, "NAvigation state: ", this.navigationState)
      });
  }

  goPrevious() {
    this.service.navigate(this.articleId, { questionId: this.navigationState.previousId! })
      .subscribe(res => {
        this.question.set(res.item as IQuestion);
        this.navigationState = res;
      });
  }

  deleteItem() {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(this.question()?.id || 0).subscribe({
          next: (res) => {
            this.goNext();
            this.showSnackbar(res.message);
          },
          //error: (error) => console.error(error)
        })
      }
    });
  }

  updateItem() {
    const q = this.question();
    console.log("Question: ", q)
    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
      width: '900px',
      data: {
        action: 'EDITAR',
        mode: 'EDITING',
        feature: this.featureType,
        rule: q?.rule,
        ruleId: q?.ruleId,
        articlesIds: q?.articlesIds || [],
        element: q
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  createElement(type: string) {
    this.entityToCreate.emit(type);
  }
}
