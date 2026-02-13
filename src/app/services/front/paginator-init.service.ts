import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Injectable()
export class MyPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getAndInitTranslations());

    this.getAndInitTranslations();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAndInitTranslations() {
    this.translate.get([
      'PAGINATOR.ITEMS_PER_PAGE',
      'PAGINATOR.NEXT_PAGE',
      'PAGINATOR.PREVIOUS_PAGE',
      'PAGINATOR.FIRST_PAGE',
      'PAGINATOR.LAST_PAGE',
      'PAGINATOR.RANGE'
    ]).subscribe(translations => {
      this.itemsPerPageLabel = translations['PAGINATOR.ITEMS_PER_PAGE'];
      this.nextPageLabel = translations['PAGINATOR.NEXT_PAGE'];
      this.previousPageLabel = translations['PAGINATOR.PREVIOUS_PAGE'];
      this.firstPageLabel = translations['PAGINATOR.FIRST_PAGE'];
      this.lastPageLabel = translations['PAGINATOR.LAST_PAGE'];
      
      // Notify the component that labels have changed
      this.changes.next();
    });
  }

  // Special logic for the "1 - 10 of 100" label
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.translate.instant('PAGINATOR.OF')} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? 
      Math.min(startIndex + pageSize, length) : 
      startIndex + pageSize;
    
    return `${startIndex + 1} ${endIndex} ${this.translate.instant('PAGINATOR.OF')} ${length}`;
  };
}