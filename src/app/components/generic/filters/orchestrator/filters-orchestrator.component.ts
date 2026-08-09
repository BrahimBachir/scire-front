import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Component, computed, effect, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { FilterConfig, FilterState, FiltersOptions, IQueryingDto, IFieldMode } from 'src/app/common/models/interfaces';
import { AppArticleFilterComponent } from '../article/article-filter.component';
import { RuleFilterComponent } from '../rule/rule-filter.component';
import { RuleAmbitFilterComponent } from '../rule-ambits/rule-ambit-filter.component';
import { RuleGazetteFilterComponent } from '../rule-gazettes/rule-gazette-filter.component';
import { RuleTypeFilterComponent } from '../rule-types/rule-type-filter.component';
import { AppSearchTermFilterComponent } from '../search-term/search-term.component';
import { AppTernaryFilterComponent } from '../ternary/ternary.component';
import { CallerFilterComponent } from '../calling-org/calling-org-filter.component';
import { CourseTypeFilterComponent } from '../course-type/course-type-filter.component';
import { CourseCategryFilterComponent } from '../course-category/course-category-filter.component';
import { IconModule } from 'src/app/icon/icon.module';
import { AppMultiSelectComponent } from '../../reusable/multi-select/multi-select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopicCategoryFilterComponent } from '../topic-category/topic-category-filter.component';
import { TopicSectionFilterComponent } from '../topic-section/topic-section-filter.component';
import { TestTypeFilterComponent } from '../test-type/test-type-filter.component';
import { TopicFilterComponent } from '../topic/topic-filter.component';

@Component({
  selector: 'app-filters-orchestrator',
  templateUrl: './filters-orchestrator.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    IconModule,
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
    CourseCategryFilterComponent,
    AppMultiSelectComponent,
    TopicCategoryFilterComponent,
    TopicSectionFilterComponent,
    TestTypeFilterComponent,
    TopicFilterComponent,
  ],
})
export class AppFiltersOrchestratorComponent {
  @ViewChildren('filter')
  filters!: QueryList<{ clean(): void }>;
  form!: FormGroup;
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

  state: FilterState = {};

  @Output()
  filtersChange = new EventEmitter<IQueryingDto>();

  ngOnInit(): void {
    this.buildForm();

    this.maxVisbleFields = this.options?.maxVisbleFields || 4;

    if(this.options.applyMode === 'auto')
      this.form.valueChanges.subscribe(value => {
        this.filtersChange.emit(value);
      })
  }

  apply(): void {
    this.filtersChange.emit(this.form.value);
  }

  clear(): void {
    this.form.reset();
  }

  toggleFilters(): void {
    this.showAll.update(v => !v);
  }

  isVisible(index: number): boolean {
    return this.showAll() || index < this.maxVisbleFields;
  }

  constructor() {
  }

  buildForm(){
    this.form = new FormGroup({
      searchTerm: new FormControl<string | null>(''),
      favorite: new FormControl<boolean | null>(null),
      ruleId: new FormControl<number | null>(null),
      articlesIds: new FormControl<number[]>([]),
      articleId: new FormControl<number | null>(null),
      ruleTypeId: new FormControl<number | null>(null),
      ruleAmbitId: new FormControl<number | null>(null),
      ruleGazetteId: new FormControl<number | null>(null),
      callerId: new FormControl<number | null>(null),
      courseTypeId: new FormControl<number | null>(null),
      courseCategoryId: new FormControl<number | null>(null),
      topicCategoryId: new FormControl<number | null>(null),
      topicId: new FormControl<number | null>(null),
      sectionId: new FormControl<number | null>(null),
      testTypeId: new FormControl<number | null>(null),
    })
  }
}
