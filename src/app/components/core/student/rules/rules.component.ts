import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LegislationService } from 'src/app/services';
import { IRule, FilterConfig, FiltersOptions, IQueryingDto } from 'src/app/common/models/interfaces';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ControlAccessPipe } from 'src/app/common/pipe/actions-access.pipe';
import { RuleFiltersData } from 'src/app/common/data/filters/rule-filter-items';
import { AppFiltersOrchestratorComponent } from 'src/app/components/generic/filters/orchestrator/filters-orchestrator.component';
import { PageEvent } from '@angular/material/paginator';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-courses',
  templateUrl: './rules.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    IconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ControlAccessPipe,
    AppFiltersOrchestratorComponent,
    TranslateModule,
    NgScrollbarModule,
  ],
  styleUrl: 'rules.component.scss'
})
export class AppRulesComponent implements OnInit {

  filtersConfig: FilterConfig[] = RuleFiltersData;
  length!: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100]
  currentPageIndex: number = 0;

  filters!: IQueryingDto;

  filterOptions: FiltersOptions = {
    applyMode: 'auto',
    maxVisbleFields: 4
  }

  editRule(_t98: IRule) {
    throw new Error('Method not implemented.');
  }
  deleteRule(arg0: number) {
    throw new Error('Method not implemented.');
  }
  create() {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/modules/create`]);
  }
  private legislationService = inject(LegislationService)
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  goToRoute(rule: IRule) {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/modules/:ruleId/details`.replace(':ruleId', rule.id.toString())]);
  }
  protected rules = signal<IRule[]>([]);
  protected filteredRules = signal<IRule[]>([]);
  protected selectedRule = signal<IRule | null>(null);

  filterForm!: FormGroup;

  ngOnInit(): void {
    this.getItems();

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredRules.set(this.filter(filterValue));
  }

  filter(value: string): IRule[] {
    //if(value.length <= 3) return;
    return this.rules()
      .filter(
        (r) => r.description.toLowerCase().indexOf(value.toLowerCase()) !== -1 || r.code.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
  }


  getItems(): void {
    this.filters = {
      ...this.filters,
      take: this.pageSize,
      skip: this.pageSize * this.currentPageIndex
    }
    this.filters.skip = this.pageSize * this.currentPageIndex;
    this.legislationService.getRules(this.filters).subscribe({
      next: (res) => {
        this.length = res.total;
        this.rules.set(res.rows as IRule[]);
        this.filteredRules.set(res.rows as IRule[]);
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  onFiltersChanged(filters: IQueryingDto) {
    this.filters = filters;
    this.getItems();
  }

  onPageChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getItems();
  }
}
