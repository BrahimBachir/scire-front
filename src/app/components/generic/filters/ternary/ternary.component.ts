import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Component, Input, model, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TernaryFilterConfig, TernaryItem } from 'src/app/common/models/interfaces';

@Component({
  selector: 'ternary-filter',
  templateUrl: './ternary.component.html',
  imports: [
    CommonModule,
    TablerIconsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class AppTernaryFilterComponent {
  value = model<boolean | null>(null);
  @Input({required: true}) config: TernaryFilterConfig | null | undefined

  clean(){
    this.value.set(null);
  }

}
