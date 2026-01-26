import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { FilterConfig, IFilters, IQueryingDto } from 'src/app/common/models/interfaces';
import { AppFiltersOrchestratorComponent } from 'src/app/components/generic/filters/orchestrator/filters-orchestrator.component';
import { FlashcardFiltersData } from 'src/app/common/data/filters/flashcard-filter-items';
import { Component, inject, Input } from '@angular/core';
import { SchemeNavigationComponent } from './navigation/scheme-navigation.component';
import { CommonFiltersData } from 'src/app/common/data';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scheme-wrapper',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MaterialModule,
    TranslateModule,
    TablerIconsModule,
    AppFiltersOrchestratorComponent,
    MatDividerModule,
    SchemeNavigationComponent,

  ],
  templateUrl: './scheme-wrapper.component.html',
  styleUrl: './scheme-wrapper.component.scss'
})
export class SchemeWrapperComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute);
  
  filtersConfig: FilterConfig[] = CommonFiltersData;
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


create() {
    this.router.navigate(['create'], { relativeTo: this.route });
}
}
