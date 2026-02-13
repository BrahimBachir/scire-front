import { Component, EventEmitter,Output } from '@angular/core';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-ai-element-create',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    IconModule,
    
  ],
  templateUrl: './ai-element-create.component.html',
  styleUrl: './ai-element-create.component.scss'
})
export class AiFormComponent {
  @Output() valueChange = new EventEmitter<string | ''>();

  onChipSelection(event: MatChipSelectionChange) {
    const selectedValue = event.source.value;
    this.valueChange.emit(selectedValue);
  }

  onSelected(value: string){
    this.valueChange.emit(value);
  }
}
