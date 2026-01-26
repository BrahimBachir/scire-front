import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Component, computed, effect, EventEmitter, Input, Output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { IRule, IArticle, FilterConfig, FilterState, FiltersOptions, IRuleAmbit, IRuleGazette, IRuleType, ICourseType, ICourseCategory, ICaller, IQueryingDto, IFieldMode } from 'src/app/common/models/interfaces';
import { AppArticleFilterComponent } from '../article/article-filter.component';
import { RuleFilterComponent } from '../rule/rule-filter.component';
import { RuleAmbitFilterComponent } from '../rule-ambits/rule-ambit-filter.component';
import { RuleGazetteFilterComponent } from '../rule-gazettes/rule-gazette-filter.component';
import { RuleTypeFilterComponent } from '../rule-types/rule-type-filter.component';
import { AppSearchTermFilterComponent } from '../search-term/search-term.component';
import { AppTernaryFilterComponent } from '../ternary/ternary.component';
import { CallerFilterComponent } from '../calling-org/calling-org-filter.component';
import { CourseTypeFilterComponent } from '../course-type/course-type-filter.component';
import { AppCourseCategryFilterComponent } from '../course-category/course-category-filter.component';

@Component({
  selector: 'app-filters-orchestrator',
  templateUrl: './filters-orchestrator.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    TablerIconsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    RuleFilterComponent,
    AppArticleFilterComponent,
    RuleAmbitFilterComponent,
    RuleGazetteFilterComponent,
    RuleTypeFilterComponent,
    AppSearchTermFilterComponent,
    AppTernaryFilterComponent,
    CallerFilterComponent,
    CourseTypeFilterComponent,
    AppCourseCategryFilterComponent,
  ],
})
export class AppFiltersOrchestratorComponent {
  @ViewChildren('filter')
  filters!: QueryList<{ clean(): void }>;

  mode: IFieldMode = 'FILTERING';

  @Input({ required: true })
  config!: FilterConfig[];

  @Input()
  options: FiltersOptions = {
    applyMode: 'auto',
    maxVisbleFields: 4
  }

  readonly showAll = signal(false);

  maxVisbleFields!: number;

  readonly state = signal<FilterState>({});

  readonly rule = signal<IRule | null>(null);
  readonly article = signal<IArticle | null>(null);

  readonly ruleCode = signal<string | null>(null);
  readonly artiCode = signal<string | null>(null);

  readonly searchTerm = signal<string | null>(null);

  readonly ruleId = signal<number | null>(null);
  readonly ruleAmbitId = signal<number | null>(null);
  readonly ruleGazetteId = signal<number | null>(null);
  readonly ruleTypeId = signal<number | null>(null);
  readonly articleId = signal<number | null>(null);
  readonly courseTypeId = signal<number | null>(null);
  readonly courseCategoryId = signal<number | null>(null);
  readonly callerId = signal<number | null>(null);
  readonly favorite = signal<boolean | null>(null);

  @Output()
  filtersChange = new EventEmitter<IQueryingDto>();

  ngOnInit(): void {
    const initialState: FilterState = {};
    this.config.forEach(f => {
      initialState[f.key] = f.defaultValue ?? null;
    });
    this.state.set(initialState);

    this.maxVisbleFields = this.options?.maxVisbleFields || 4;
  }

  update(key: string, value: unknown): void {
    this.state.update(s => ({ ...s, [key]: value }));
    //console.log("State: ", this.state)
  }

  valueOf<T>(key: string): T | null {
    return (this.state()[key] as T) ?? null;
  }

  apply(): void {
    this.filtersChange.emit(this.state());
  }

  clear(): void {
    const cleared: FilterState = {};

    this.config.forEach(f => {
      cleared[f.key] = f.defaultValue ?? null;
    });

    this.state.set(cleared);
    this.filters.forEach(f => f.clean());

    this.filtersChange.emit(cleared);
  }

  readonly appliedFilters = computed(() => {
    const s = this.state();
    return s;
  });

  toggleFilters(): void {
    this.showAll.update(v => !v);
  }

  isVisible(index: number): boolean {
    return this.showAll() || index < this.maxVisbleFields;
  }

  constructor() {
    effect(() => {
      const state = this.state();

      this.config.forEach(filter => {
        if (!filter.dependsOn) return;

        const dependencyValue = state[filter.dependsOn];
        const currentValue = state[filter.key];

        if (!dependencyValue && currentValue !== null) {
          this.update(filter.key, null);
        }
      });
    });

    effect(() => this.update('rule', this.rule()));
    effect(() => this.update('ruleCode', this.ruleCode()));
    effect(() => this.update('ruleId', this.ruleId()));
    effect(() => this.update('article', this.article()));
    effect(() => this.update('articleId', this.articleId()));
    effect(() => this.update('artiCode', this.artiCode()));
    effect(() => this.update('ruleTypeId', this.ruleTypeId()));
    effect(() => this.update('ruleAmbitId', this.ruleAmbitId()));
    effect(() => this.update('ruleGazetteId', this.ruleGazetteId()));
    effect(() => this.update('favorite', this.favorite()));
    effect(() => this.update('searchTerm', this.searchTerm()));
    effect(() => this.update('callerId', this.callerId()));
    effect(() => this.update('courseTypeId', this.courseTypeId()));
    effect(() => this.update('courseCategoryId', this.courseCategoryId()));

    effect(() => {
      if (this.options.applyMode !== 'auto') return;

      this.appliedFilters();

      this.filtersChange.emit(this.state());
    });
  }
}
