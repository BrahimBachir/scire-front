import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FlashcardService } from 'src/app/services';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { FeatureType, IFlashcard } from 'src/app/common/models/interfaces';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';

@Component({
  selector: 'app-flashcard',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    AppReactionsComponent,
    MatDividerModule
  ],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss'
})
export class FlashcardComponent implements OnInit, OnChanges {
  private service = inject(FlashcardService)
  featureType: FeatureType = 'FLASHCARD';

  @Input() ruleCode!: string;
  @Input() artiCode!: string;
  flashcard = signal<IFlashcard | null>(null);

  isFlipped: boolean = false;
  direction: string = 'FORWARD';

  ngOnInit(): void {
    this.getFlashcard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  getNext() {
    this.direction = 'FORWARD';
    this.getFlashcard();
  }

  getPrevious() {
    this.direction = 'BACKWARD';
    this.getFlashcard();
  }

  getFlashcard() {
    console.log("Data to be sent: ",this.direction, this.flashcard()?.id)
    this.service.navigate(this.ruleCode, this.artiCode, { flashcardId: this.flashcard()?.id || 0, direction: this.direction }).subscribe({
      next: (data) => {
        console.log("Flashcard from the server: ", data)
        this.flashcard.set(data);
      },
      error: (error) => console.error(error)
    })
  }
}
