import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input, OnInit, inject, ChangeDetectorRef } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { Subject, takeUntil } from "rxjs";
import { IFieldMode, IRule } from "src/app/common/models/interfaces";
import { AppState } from "src/app/common/store/app.store";
import { getSelectedRule } from "src/app/common/store/selectors/learning.selectors";
import { RuleFilterComponent } from "src/app/components/generic/filters/rule/rule-filter.component";
import { AppMultiSelectComponent } from "src/app/components/generic/reusable/multi-select/multi-select.component";
import { IconModule } from "src/app/icon/icon.module";
import { MaterialModule } from "src/app/material.module";

@Component({
  selector: 'app-block-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MaterialModule,
    MatExpansionModule,
    MatButtonModule,
    IconModule,
    MatDividerModule,
    MatTooltipModule,
    RuleFilterComponent,
    AppMultiSelectComponent,
  ],
  templateUrl: './block-form.component.html',
  styleUrl: './block-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockFormComponent implements OnInit {
  @Input({ required: true }) form!: FormArray;
  mode: IFieldMode;
  rule: IRule | null = null;
  private store = inject(Store<AppState>)
  private destroy$ = new Subject<void>();
  
ngOnInit(): void {
  this.store.select(getSelectedRule)
    .pipe(takeUntil(this.destroy$))
    .subscribe(rule => {
      if (rule) {
        this.rule = rule;
      }
    });
}

  get blocks(): FormArray {
    return this.form as FormArray;
  }

  onAddRow(): void {
    const newBlock = new FormGroup({
      id: new FormControl(null),
      description: new FormControl('', Validators.required),
      ruleId: new FormControl(null, Validators.required),
      articlesIds: new FormControl([], Validators.required)
    });
    this.form.push(newBlock);
  }

  onRemoveRow(rowIndex: number): void {
    this.form.removeAt(rowIndex);
  }
}