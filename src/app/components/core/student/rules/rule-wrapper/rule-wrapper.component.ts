import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "src/app/material.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { LegislationService } from "src/app/services";
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
import { RuleFormComponent } from "../form/rule-form.component";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { IFieldMode, IRule } from "src/app/common/models/interfaces";

@Component({
  selector: 'app-create-edit-rule',
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
    RuleFormComponent
  ],
  templateUrl: 'rule-wrapper.component.html',
  styleUrl: 'rule-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class RuleFormWrapperComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  mode: IFieldMode = 'CREATING';

  ruleId = Number(this.route.snapshot.paramMap.get('ruleId')) || null;


  ruleForm!: FormGroup;
  locateRuleForm!: FormGroup;
  savingRule: boolean = false;

  action: string | any;
  title: string | any;
  local_data: IRule; // TODO: Refactor and type 

  protected boeRuleLocated = signal<boolean | null>(null);
  protected alreadyExists = signal<boolean | null>(null);



  constructor(
    private snackBar: MatSnackBar,
    private service: LegislationService,
  ) {
  }

  ngOnInit(): void {
    if (this.router.url.includes('edit')) {
      this.mode = 'EDITING';
      this.getRule(this.ruleId!);
    } else {

    }

    this.locateRuleForm = new FormGroup({
      isLegalRule: new FormControl<boolean | null>(null),
      inBOE: new FormControl<boolean | null>({value: null, disabled: true}),
      ruleCodeControl: new FormControl<string>({ value: '', disabled: true }),
    });

    this.locateRuleForm.get('isLegalRule')?.valueChanges.pipe(
    ).subscribe((value: boolean) => {
      if (value) {
        this.locateRuleForm.get('inBOE')?.enable();
      } else {
        this.locateRuleForm.get('inBOE')?.disable();
        this.locateRuleForm.get('inBOE')?.setValue(null);
        this.locateRuleForm.get('ruleCodeControl')?.disable();
        this.locateRuleForm.get('ruleCodeControl')?.setValue('');
      }
    });

    this.locateRuleForm.get('inBOE')?.valueChanges.pipe(
    ).subscribe((value: boolean) => {
      if (value)
        this.locateRuleForm.get('ruleCodeControl')?.enable();
      else {
        this.locateRuleForm.get('ruleCodeControl')?.disable();
        this.locateRuleForm.get('ruleCodeControl')?.setValue('');
      }
    });
  }

  isSearchDisabled = computed(() => {

    return !this.locateRuleForm.get('isLegalRule')?.value ||
      !this.locateRuleForm.get('inBOE')?.value ||
      this.locateRuleForm.get('isLegalRule')?.value === false ||
      this.locateRuleForm.get('inBOE')?.value === false
  });

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  seachBoeRule() {
    let code: string = this.locateRuleForm.get('ruleCodeControl')?.value || '';
    this.service.getMetadata({ ruleCode: code.trim() }).subscribe({
      next: source => {
        if (source?.id) {
          this.local_data = { ...source };
          this.alreadyExists.set(true);
          this.boeRuleLocated.set(false);
          this.openSnackBar('Norma localizada!', 'Cerrar');
        } else {
          source.fromBOE = true;
          this.local_data = source;
          this.alreadyExists.set(false);
          // Only reveal the form once the articles fetch has settled, so the
          // form is never built from a rule whose boeIndex hasn't arrived yet.
          this.loadRuleArticles(code);
        }
      },
      error: () => {
        this.openSnackBar('Error al localizar la norma en el BOE', 'Cerrar');
      }
    });
  }

  cleanForm() {
    this.locateRuleForm.reset();
    this.local_data = {} as IRule;
    this.boeRuleLocated.set(null);
    this.alreadyExists.set(null);
  }

  private loadRuleArticles(code: string) {
    this.service.getIndex({ ruleCode: code.trim() }).subscribe({
      next: articles => {
        this.local_data = {
          ...this.local_data,
          boeIndex: articles ?? []
        };
        if (articles && articles.length > 0) {
          this.openSnackBar('Norma localizada!', 'Cerrar');
        } else {
          this.openSnackBar('Norma localizada, pero no se pudieron recuperar sus artículos del BOE. Revísalos manualmente.', 'Cerrar');
        }
        this.boeRuleLocated.set(true);
      },
      error: () => {
        this.local_data = {
          ...this.local_data,
          boeIndex: []
        };
        this.openSnackBar('Norma localizada, pero no se pudieron recuperar sus artículos del BOE. Revísalos manualmente.', 'Cerrar');
        this.boeRuleLocated.set(true);
      }
    });
  }

  getRule(id: number) {
    this.service.getRuleById(id).subscribe({
      next: (rule) => {
        this.local_data = rule;
      },
      error: (err) => {
        this.openSnackBar('Error al recuperar la norma', 'Cerrar');
      }
    });
  }

  goToRule(id: number) {
    this.savingRule = false;
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/modules/:ruleId/details`
        .replace(':ruleId', id.toString())
    ]);
  }
}
