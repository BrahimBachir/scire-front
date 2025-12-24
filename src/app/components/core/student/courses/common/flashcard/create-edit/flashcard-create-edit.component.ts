import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IArticle, IFlashcard, IRule } from 'src/app/common/models/interfaces';
@Component({
  selector: 'app-flashcard-create-edit',
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    TablerIconsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './flashcard-create-edit.component.html',
  styleUrl: './flashcard-create-edit.component.scss'

})
export class AppFlashcardCreateEditComponent implements OnInit {
  @Input() flashcard!: IFlashcard;
    @Input() rule!: IRule;
    @Input() article!: IArticle;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();


  ngOnInit(): void {
    console.log("There is a flashcard to edit!")
    if(!this.flashcard)
        console.log("There is no flashcard to edit")
    console.log("There is a flashcard to edit!")
  }

}
