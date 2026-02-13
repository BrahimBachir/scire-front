import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ArticlesService } from 'src/app/services';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { IArticle, IFieldMode } from 'src/app/common/models/interfaces';
import { MatChipsModule } from '@angular/material/chips';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
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
    MatChipsModule
  ],
})
export class AppMultiSelectComponent
  implements ControlValueAccessor {
  private service = inject(ArticlesService);

  @Input() mode: IFieldMode = 'FILTERING';
  @Input() parentId: number | null = null;
  @Output() valueChange = new EventEmitter<number | null>();

  public ngControl = inject(NgControl, { self: true, optional: true });

  control = new FormControl<string | null>(null);

  items: IArticle[] = [];
  filteredItems: IArticle[] = [];
  selectedItems: IArticle[] = [];

  protected value: number[] = [];


  private onChange: (value: number[]) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    if (this.ngControl)
      this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    console.log("ArticlesIds: ",this.value)
    this.loadData();

    if (this.ngControl?.control) {
      this.control.setValidators(this.ngControl.control.validator);
      this.control.updateValueAndValidity({ emitEvent: false });
    }
  }

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
    this.control.setValue('', { emitEvent: true });
    this.value = [];                               
    this.selectedItems = [];                       
    this.filteredItems = [...this.items];          
    this.onChange([]);
    this.onTouched();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ParentId: ", changes['parentId'])
    if (changes['parentId']) {
      if (this.parentId) {
        this.control.enable({ emitEvent: false });
      } else {
        this.control.disable({ emitEvent: false });
      }

      if (!changes['parentId'].firstChange) {
        this.onParentChange();
      }
    }
  }

  private onParentChange(): void {
    this.clean();
    this.loadData();
  }

  private loadData(): void {
    this.service.getArticlesByRule(this.parentId ?? 0)
      .subscribe(data => {
        this.items = data;
        this.filteredItems = data;
        this.filter(this.control.value);
        this.syncSelectedItems();
      });
  }

  private syncSelectedItems(): void {
    if (!this.items.length || !this.value.length) {
      this.selectedItems = [];
      return;
    }

    const itemMap = new Map<number, IArticle>(
      this.items.map(item => [item.id!, item])
    );

    this.selectedItems = this.value
      .map(id => itemMap.get(id))
      .filter((item): item is IArticle => !!item);
  }

  /*   private filter(value: string | null): IArticle[] {
      const filterValue = (value ?? '').toLowerCase();
      return this.items.filter(item =>
        item.title.toLowerCase().includes(filterValue) ||
        item.boeId?.toLowerCase().includes(filterValue)
      );
    } */

  filter(searchValue: string | null): void {
    const text = (searchValue ?? '').toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.title.toLowerCase().includes(text) ||
      item.boeId?.toLowerCase().includes(text) // Helpful to filter by ID too!
    );
  }
}