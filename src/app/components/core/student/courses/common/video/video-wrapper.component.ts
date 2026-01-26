import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonFiltersData } from 'src/app/common/data/filters/common-filter-items';
import { FilterConfig, IFilters, IQueryingDto, IVideo } from 'src/app/common/models/interfaces';
import { AppBannersNoFiltersComponent } from 'src/app/components/generic/banners/no-filters/banner-no-filters.component';
import { AppFiltersOrchestratorComponent } from 'src/app/components/generic/filters/orchestrator/filters-orchestrator.component';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-video-wrapper',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    AppFiltersOrchestratorComponent,
        TranslateModule,
        IconModule,
    AppBannersNoFiltersComponent,
  ],
  templateUrl: './video-wrapper.component.html',
  styleUrl: './video-wrapper.component.scss'
})
export class VideoWrapperComponent implements OnInit, OnChanges {
create() {
throw new Error('Method not implemented.');
}
  filtersConfig: FilterConfig[] = CommonFiltersData;
  filters!: IQueryingDto;
  direction: string = 'FORWARD';
  video = signal<IVideo | null>(null);
  bannerText: string = 'Por favor, seleccione, al menos, un filtro.';

  @Input() ruleId!: number;
  @Input() articleId!: number;

  ngOnInit(): void {
  }
  
  onFiltersChanged(filters: IQueryingDto) {
    this.filters = filters;
    this.ruleId = this.filters?.ruleId || 0;
    this.articleId = this.filters?.articleId || 0;
  }

  getNext() {
 
  }

  getItems() {
    throw new Error('Method not implemented.');
  }

  getPrevious() {
    this.direction = 'BACKWARD';
    this.getItems();
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }
}
