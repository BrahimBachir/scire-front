import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ArticlesService } from 'src/app/services';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { IArticle, IFieldMode, IRule } from 'src/app/common/models/interfaces';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { getSelectedRule } from 'src/app/common/store/selectors/learning.selectors';
import { IconModule } from 'src/app/icon/icon.module';
import { BaseFilterDirective } from 'src/app/common/directives';

@Component({
  selector: 'article-filter',
  templateUrl: './article-filter.component.html',
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
  ],
})
export class AppArticleFilterComponent  extends BaseFilterDirective<IArticle> {
  private service = inject(ArticlesService);


  loadData(): void {
    this.service.getArticlesByRule(this.parentId ?? 0).subscribe(data => {
      this.items = data;
      this.filteredItems = data;
      this.syncInternalControl();
    });
  }
}

/* export class AppArticleFilterComponent implements ControlValueAccessor, OnInit {
  private service = inject(ArticlesService)
  private store = inject(Store<AppState>);

  @Input() mode: IFieldMode = 'FILTERING';
  @Input() rule: IRule | null | undefined = null;

  control = new FormControl<IArticle | string | null>(null);

  items: IArticle[] = [];
  filteredItems: IArticle[] = [];

  private value: number | null = null;
  private onChange: (value: number | null) => void = () => { };
  onTouched: () => void = () => { };

  ngOnInit(): void {
    this.store.select(getSelectedRule).subscribe(rule => {
      if (rule) this.rule = rule;
    });
    this.getItems();

    this.control.valueChanges
      .pipe(startWith(''), debounceTime(200))
      .subscribe(value => {
        this.filteredItems = this.filter(value);
      });
  }

  writeValue(value: number | null): void {
    this.value = value;
    const selected = this.items.find(s => s.id === value) || null;
    this.control.setValue(selected, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  onSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IArticle;
    if (selected && selected.id)
      this.value = selected.id;
    this.onChange(this.value);
    this.onTouched();
  }

  displayName = (entity: IArticle | string | null): string =>
    typeof entity === 'object' && entity ? entity.title : '';

  private getItems(): void {
    this.service.getArticlesByRule(this.rule?.id || 0).subscribe(data => {
      this.items = data;
      this.filteredItems = data;

      this.applyCurrentValue();
    });
  }

  private filter(value: IArticle | string | null): IArticle[] {
    const text =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.title.toLowerCase() || '';

    return this.items.filter(i =>
      i.title.toLowerCase().includes(text)
    );
  }

  clean() {
    this.control.reset(null, { emitEvent: false });
    this.filteredItems = [...this.items];
  }

  private applyCurrentValue(): void {
    if (this.value != null) {
      this.writeValue(this.value);
      return;
    }
  }
} */

/* export class AppArticleFilterComponent implements OnInit {
private service = inject(ArticlesService)

protected control = new FormControl<IArticle | string>('');
@Input() mode: IFieldMode = 'FILTERING'; //type IFieldMode = "EDITING" | "CREATING" | "FILTERING"

protected items = signal<IArticle[]>([]);
protected filteredItems = signal<IArticle[]>([]);
selectedItem = model<IArticle | null>(null);
private previousRuleId = signal<number | null>(null);

rule = input<IRule | null>(null);
editable = input<boolean>(true);
filtering = input<boolean>(true);

private shouldLoadArticles = signal(false);


form!: FormGroup;

constructor() {
  effect(() => {
    const rule = this.rule();
    const article = this.selectedItem();
    const editable = this.editable();

    // ─────────────────────────────
    // CASE: no rule → always disabled
    // ─────────────────────────────
    if (!rule || rule.code === 'ALL') {
      this.control.disable({ emitEvent: false });
      this.control.reset(null, { emitEvent: false });
      this.shouldLoadArticles.set(false);
      return;
    }

    // ─────────────────────────────
    // CASE: article exists
    // ─────────────────────────────
    if (article) {
      this.control.setValue(article, { emitEvent: false });

      if (editable) {
        this.control.enable({ emitEvent: false });
        this.shouldLoadArticles.set(true);
      } else {
        this.control.disable({ emitEvent: false });
        this.shouldLoadArticles.set(false);
      }

      return;
    }

    // ─────────────────────────────
    // CASE: rule exists, no article
    // ─────────────────────────────
    this.control.enable({ emitEvent: false });
    this.control.reset(null, { emitEvent: false });
    this.shouldLoadArticles.set(true);
  });

  effect(() => {
    if (!this.shouldLoadArticles()) {
      this.filteredItems.set([]);
      return;
    }

    const rule = this.rule();
    if (!rule) return;

    this.getItems();
  });

  effect(() => {
    const rule = this.rule();
    const currentRuleId = rule?.id ?? null;
    const prevRuleId = this.previousRuleId();

    if (prevRuleId && currentRuleId && prevRuleId !== currentRuleId) {
      // Rule changed → reset article
      this.selectedItem.set(null);
      this.control.reset(null, { emitEvent: false });
    }

    this.previousRuleId.set(currentRuleId);
  });
  
  this.control.valueChanges.subscribe({ 
    next: (value) => {if(value === '') this.selectedItem.set(null)} 
  })
}

clean(){
  this.selectedItem.set(null);
  this.control.reset(null, { emitEvent: false });
  this.filteredItems.set(this.items());
}

ngOnInit(): void {
  if (!this.selectedItem)
    this.getItems();

  this.control.valueChanges.pipe(
    startWith(''),
    debounceTime(200),
  ).subscribe(value => {
    this.filteredItems.set(this._filter(value || ''));
  });
}

getItems(): void {
  this.service.getArticlesByRule({ ruleCode: this.rule()?.code }).subscribe({
    next: (data) => {
      if (this.filtering())
        data.unshift(this.all)
      this.items.set(data);
      this.filteredItems.set(data);
    },
    //error: (err) => console.error('Error fetching categories:', err),
  });
}

private _getFilterValue(value: IArticle | string | null): string {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }
  if (value && value.title) {
    return value.title.toLocaleLowerCase();
  }
  return '';
}

private _filter(value: IArticle | string | null): IArticle[] {
  const filterValue = this._getFilterValue(value);
  return this.items().filter((item) => item.title.toLowerCase().includes(filterValue));
}


displayName = (entity: IArticle | string | null): string => {
  return (entity && typeof entity !== 'string' && entity.title) ? entity.title : (entity as string || '');
};

onSelected(event: MatAutocompleteSelectedEvent): void {
  const selected = event.option.value as IArticle;
  this.selectedItem.set(selected);
}

all: IArticle = {
  id: 0,
  boeId: 'ALL',
  title: 'Todos',
  versions: []
}
}*/