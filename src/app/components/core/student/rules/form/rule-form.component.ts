import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal, SimpleChanges } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "src/app/material.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IRule, IRuleType, IRuleAmbit, IRuleGazette, IMetadataSource, IRuleIndex } from "src/app/common/models/interfaces";
import { LegislationService } from "src/app/services";
import { parseDate } from "src/app/common/utils/parse-date.util";
import { startWith, debounceTime, finalize } from "rxjs";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { IconModule } from "src/app/icon/icon.module";
import { RuleStrategy } from "src/app/strategies/rule.strategy";
import { RuleAmbitFilterComponent } from "src/app/components/generic/filters/rule-ambits/rule-ambit-filter.component";
import { RuleGazetteFilterComponent } from "src/app/components/generic/filters/rule-gazettes/rule-gazette-filter.component";
import { RuleTypeFilterComponent } from "src/app/components/generic/filters/rule-types/rule-type-filter.component";
import { RuleArticlesComponent } from "./articles/rule-articles.component";

@Component({
  selector: 'app-rule-form',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RuleAmbitFilterComponent,
    RuleGazetteFilterComponent,
    RuleTypeFilterComponent,
    RuleArticlesComponent
  ],
  templateUrl: 'rule-form.component.html',
  styleUrl: 'rule-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter(), RuleStrategy],
})
export class RuleFormComponent implements OnInit {
  private router = inject(Router);
  private _rule: IRule | null = null;
  private baseRoleUrl: string = '';

  @Input() set rule(value: IRule | null) {
    this._rule = value;
    if (value) {
      this.form = this.strategy.buildForm(value);

      if (value.fromBOE) {
        this.disableRuleFormFields();
      }
    }
  }

  get rule(): IRule | null {
    return this._rule;
  }
  
  loading = false;
  error: string | null = null;
  boeIndex: IRuleIndex[] | any;

  form!: FormGroup;

  private snackBar = inject(MatSnackBar);
  private strategy = inject(RuleStrategy);

  ngOnInit(): void {

    const currentUrl = this.router.url;
    this.baseRoleUrl = currentUrl.split('/')[1];

    this.form = this.strategy.buildForm(this.rule ?? undefined);

    this.submit = () => {
      this.loading = true;
      this.error = null;

      this.strategy.submit(this.form)
        //.pipe(finalize(() => this.loading = false))
        .subscribe({
          next: result => {
            this.openSnackBar('Norma actualizada correctamente', 'Cerrar');
            this.loading = false;
            this.router.navigate([this.baseRoleUrl, 'modules', result.id,'details']);
          },
          error: () => {
            this.loading = false;
            this.error = 'Error al guardar la norma'
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rule'] && this.rule) {
      this.form = this.strategy.buildForm(this.rule);

      if (this.rule.fromBOE) {
        this.disableRuleFormFields();
      }
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  submit!: () => void;

  disableRuleFormFields() {
    this.form.get('code')?.disable();
    this.form.get('description')?.disable();
    this.form.get('typeId')?.disable();
    this.form.get('ambitId')?.disable();
    this.form.get('gazetteId')?.disable();
    this.form.get('internal')?.disable();
    this.form.get('repealed')?.disable();
    this.form.get('updateDate')?.disable();
    this.form.get('enactmentDate')?.disable();
    this.form.get('effectiveDate')?.disable();
  }

  get articlesArray(): FormArray {
    return this.form.get('articles') as FormArray;
  }

  get boeIndexArray(): FormArray {
    return this.form.get('boeIndex') as FormArray;
  }
}
