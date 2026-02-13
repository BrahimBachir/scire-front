import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FilterConfig, IQueryingDto } from 'src/app/common/models/interfaces';
import { AppFiltersOrchestratorComponent } from 'src/app/components/generic/filters/orchestrator/filters-orchestrator.component';
import { Component, inject, Input } from '@angular/core';
import { CommonFiltersData } from 'src/app/common/data';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { Router, ActivatedRoute } from '@angular/router';
import { IconModule } from 'src/app/icon/icon.module';
import { DiagramNavigationComponent } from './navigation/diagram-navigation.component';

@Component({
  selector: 'app-diagram-wrapper',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MaterialModule,
    TranslateModule,
    IconModule,
    AppFiltersOrchestratorComponent,
    MatDividerModule,
    DiagramNavigationComponent,

  ],
  templateUrl: './diagram-wrapper.component.html',
  styleUrl: './diagram-wrapper.component.scss'
})
export class DiagramWrapperComponent {
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
