import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FeatureFormComponent } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';

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
    IconModule,
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
