import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatChipsModule } from '@angular/material/chips';
import { IconModule } from 'src/app/icon/icon.module';
import { BaseMultiSelectCva } from 'src/app/common/directives';
import { LearningService } from 'src/app/services';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITopic } from 'src/app/common/models/interfaces';

@Component({
  selector: 'app-multi-topic-select',
  templateUrl: './multi-topic-select.component.html',
  styleUrl: './multi-topic-select.component.scss',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    IconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocomplete,
    MatChipsModule
  ],
})
export class TopicMultiSelectComponent extends BaseMultiSelectCva<ITopic> implements OnChanges {

  @Input() courseId: number | null = null;

  private service = inject(LearningService);

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes['courseId'] && !changes['courseId'].firstChange) {
      this.onParentChange();
    }
  }

  protected loadData(): void {
    if (!this.parentId) {
      this.items = [];
      this.filteredItems = [];
      return;
    }

    this.service.getTopics({ parentId: this.parentId ?? 0, courseId: this.courseId ?? undefined })
      .subscribe(res => {
        this.items = res.rows as ITopic[];
        this.filteredItems = res.rows as ITopic[];
        this.syncSelectedItems();
      });
  }

  protected override displayLabel(item: ITopic): string {
    return `${item.name} - ${item.description}`; // or boeId if needed
  }
}