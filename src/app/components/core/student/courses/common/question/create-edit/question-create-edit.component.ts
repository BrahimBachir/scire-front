import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { QuestionService } from 'src/app/services';

@Component({
  selector: 'app-question-create-edit',
  imports: [],
  templateUrl: './question-create-edit.component.html',
  styleUrl: './question-create-edit.component.scss'
})
export class AppQuestionCreateEditComponent implements OnInit, OnChanges {
  private service = inject(QuestionService)
  @Input() ruleCode!: string;
  @Input() artiCode!: string;

  ngOnInit(): void {
    this.service.getByRule(this.ruleCode, this.artiCode).subscribe({
      next: (data) => {
        console.log("Question from the server: ",data)
      },
      error: (error) => console.error(error) 
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }
}
