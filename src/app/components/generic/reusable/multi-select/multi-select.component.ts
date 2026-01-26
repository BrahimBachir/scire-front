import { Component, effect, EventEmitter, forwardRef, inject, Input, input, model, OnInit, Output, output, signal, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ArticlesService } from 'src/app/services';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { IArticle, IFieldMode, IRule } from 'src/app/common/models/interfaces';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { setAllSelectedArticles } from 'src/app/common/store/actions';
import { AppState } from 'src/app/common/store/app.store';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    TablerIconsModule,
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppMultiSelectComponent),
      multi: true,
    },
  ],
})
export class AppMultiSelectComponent
  implements ControlValueAccessor {

  private service = inject(ArticlesService);
  private state = inject(Store<AppState>);

  @Input() rule: IRule | null | undefined;
  @Input() mode: IFieldMode = 'FILTERING';

  /** 🔹 CVA VALUE (source of truth) */
  private value: number[] = [];

  /** 🔹 UI STATE */
  control = new FormControl('');
  items = signal<IArticle[]>([]);
  filteredItems = signal<IArticle[]>([]);
  selectedItems = signal<IArticle[]>([]);

  private onChange: (value: number[]) => void = () => { };
  private onTouched: () => void = () => { };

  private previousRuleId: number | null = null;

  constructor() {
    // Filter autocomplete
    this.control.valueChanges
      .pipe(startWith(''), debounceTime(200))
      .subscribe(value => {
        this.filteredItems.set(this.filter(value));
      });

/*     // React to rule changes
    effect(() => {
      const rule = this.rule;
      if (!rule) {
        this.reset();
        return;
      }

      if (this.previousRuleId !== null && rule.id !== this.previousRuleId) {
        this.reset();
      }

      this.previousRuleId = rule.id;
      this.loadItems();
    }); */
  }

  // ─────────────────────────────────────────────
  // CVA IMPLEMENTATION
  // ─────────────────────────────────────────────

  writeValue(ids: number[] | null): void {
    this.value = ids ?? [];
    this.syncSelectedItems();
  }

  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  // ─────────────────────────────────────────────
  // UI BEHAVIOR
  // ─────────────────────────────────────────────

  toggleSelection(article: IArticle): void {
    const exists = this.value.includes(article.id!);

    this.value = exists
      ? this.value.filter(id => id !== article.id)
      : [...this.value, article.id!];

    this.onChange(this.value);
    this.onTouched();

    this.syncSelectedItems();
    console.log("Articles: ", this.value)
  }

  remove(article: IArticle): void {
    this.value = this.value.filter(id => id !== article.id);
    this.onChange(this.value);
    this.syncSelectedItems();
  }

  isSelected(article: IArticle): boolean {
    return this.value.includes(article.id!);
  }

  clean(): void {
    this.value = [];
    this.onChange(this.value);
    this.syncSelectedItems();
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['rule']) {
    const rule: IRule | null = changes['rule'].currentValue;
    if (!rule) { this.reset(); return; }

    if (this.previousRuleId !== null && rule.id !== this.previousRuleId) {
      this.reset();
    }

    this.previousRuleId = rule.id;
    this.loadItems();
  }
}

  // ─────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────

  private loadItems(): void {
    if (!this.rule || this.rule.code === 'ALL') return;

    this.service.getArticlesByRule(this.rule.id)
      .subscribe(data => {
        this.items.set(data);
        this.filteredItems.set(data);
        this.syncSelectedItems();
      });
  }

  private syncSelectedItems(): void {
    const resolved = this.items().filter(a =>
      this.value.includes(a.id!)
    );
    this.selectedItems.set(resolved);
    this.state.dispatch(setAllSelectedArticles(resolved))
  }

  private reset(): void {
    this.items.set([]);
    this.filteredItems.set([]);
    this.selectedItems.set([]);
    this.value = [];
    this.onChange([]);
    this.onTouched();
  }

  private filter(value: string | null): IArticle[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.items().filter(item =>
      item.title.toLowerCase().includes(filterValue)
    );
  }
}

/* export class AppMultiSelectComponent {
  private service = inject(ArticlesService)
  protected control = new FormControl<string>('');
  private previousRuleId = signal<number | null>(null);

  protected items = signal<IArticle[]>([]);
  protected filteredItems = signal<IArticle[]>([]);
  selectedItems = model<IArticle[]>([]);
  incomingIds = input<string[] | null>(null);
  selectedItemIds = model<string[] | null>();
  @Input() mode: IFieldMode = 'FILTERING'; //type IFieldMode = "EDITING" | "CREATING" | "FILTERING"

  rule = input<IRule | null | undefined>(null);

  form!: FormGroup;

  constructor() {
    effect(() => {
      const selected = this.selectedItems();
      const ids = selected.map(a => a.boeId!);
      this.selectedItemIds.set(ids);
    });

    effect(() => {
      const rule = this.rule();
      const prev = this.previousRuleId();

      if (!rule) return;

      if (prev !== null && rule.id !== prev) {
        this.items.set([]);
        this.selectedItems.set([]);
      }

      this.previousRuleId.set(rule.id);
    });

    effect(() => {
      const rule = this.rule();
      if (!rule || rule.code === 'ALL') return;

      this.getItems();
    });

    effect(() => {
      const rule = this.rule();

      if (rule === null) {
        this.items.set([]);
        this.selectedItems.set([]);
      }
    });

    effect(() => {
      const items = this.items();
      if (!items.length) return;

      const ids = this.incomingIds();

      if (!ids || !ids.length) return;

      const resolved = items.filter(a =>
        ids.includes(a.boeId!)
      );

      this.selectedItems.set(resolved);
    });

      this.control.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
      ).subscribe(value => {
        this.filteredItems.set(this._filter(value));
      });
  }

  private _filter(value: string | null): IArticle[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.items().filter(item =>
      item.title.toLowerCase().includes(filterValue)
    );
  }


  getItems(): void {
    this.service.getArticlesByRule({ ruleCode: this.rule()?.code }).subscribe({
      next: (data) => {
        this.items.set(data);
        this.filteredItems.set(data);
      },
      //error: (err) => console.error('Error fetching categories:', err),
    });
  }

  all: IArticle = {
    id: 0,
    boeId: 'ALL',
    title: 'Todos',
    versions: []
  }

  toggleSelection(article: IArticle): void {
    const selected = this.selectedItems();
    const exists = selected.some(a => a.boeId === article.boeId);

    this.selectedItems.set(
      exists
        ? selected.filter(a => a.boeId !== article.boeId)
        : [...selected, article]
    );
  }

  isSelected(article: IArticle): boolean {
    return this.selectedItems().some(a => a.boeId === article.boeId);
  }

  remove(article: IArticle): void {
    this.selectedItems.set(
      this.selectedItems().filter(a => a.boeId !== article.boeId)
    );
  }

  clean(){
    this.selectedItems.set([]);

  } 

}*/

/**
   @Input() rule!: IRule;

  value: number[] = [];

  private onChange = (value: number[]) => {};
  private onTouched = () => {};

  writeValue(value: number[] | null): void {
    this.value = value ?? [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // optional
  }

  // call this when selection changes
  updateSelection(ids: number[]) {
    this.value = ids;
    this.onChange(ids);
    this.onTouched();
  }
 */