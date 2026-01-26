import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FlashcardService } from 'src/app/services';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { FeatureType, FilterConfig, IFilters, IFlashcard, IQueryingDto } from 'src/app/common/models/interfaces';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';
import { AppFiltersOrchestratorComponent } from 'src/app/components/generic/filters/orchestrator/filters-orchestrator.component';
import { FlashcardFiltersData } from 'src/app/common/data/filters/flashcard-filter-items';
import { FlashcardNavigationComponent } from './navigation/flashcard-navigation.component';

@Component({
  selector: 'app-flashcard-wrapper',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    AppFiltersOrchestratorComponent,
    MatDividerModule,
    FlashcardNavigationComponent
  ],
  templateUrl: './flashcard-wrapper.component.html',
  styleUrl: './flashcard-wrapper.component.scss'
})
export class FlashcardWrapperComponent {
  filtersConfig: FilterConfig[] = FlashcardFiltersData;
  filters!: IQueryingDto;

  length!: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100]
  currentPageIndex: number = 0;


  @Input() ruleId!: number;
  @Input() articleId!: number;

  onFiltersChanged(filters: IQueryingDto) {
    this.filters = filters;
    this.ruleId = this.filters?.ruleId || 0;
    this.articleId = this.filters?.articleId || 0;
  }
}
