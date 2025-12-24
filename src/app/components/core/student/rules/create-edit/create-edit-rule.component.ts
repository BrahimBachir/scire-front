import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, Optional, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TablerIconsModule } from "angular-tabler-icons";
import { MaterialModule } from "src/app/material.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IRule, DialogData, IRuleType, IRuleAmbit, IGazette, IMetadataSource, IRuleIndex } from "src/app/common/models/interfaces";
import { LegislationService } from "src/app/services";
import { parseDate } from "src/app/common/utils/parse-date.util";
import { startWith, debounceTime } from "rxjs";
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

@Component({
  selector: 'app-create-edit-rule',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TablerIconsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocomplete,
    MatDatepickerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: 'create-edit-rule.component.html',
  styleUrl: 'create-edit-rule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class AppCreateEditRuleComponent implements OnInit {

  ruleForm!: FormGroup;
  locateRuleForm!: FormGroup;
  savingRule: boolean = false;

  protected types = signal<IRuleType[]>([]);
  protected filteredTypes = signal<IRuleType[]>([]);
  protected selectedType = signal<IRuleType | null>(null);

  protected ambits = signal<IRuleAmbit[]>([]);
  protected filteredAmbits = signal<IRuleAmbit[]>([]);
  protected selectedAmbit = signal<IRuleAmbit | null>(null);

  protected gazettes = signal<IGazette[]>([]);
  protected filteredGazettes = signal<IGazette[]>([]);
  protected selectedGazettes = signal<IGazette | null>(null);

  protected typeControl = new FormControl<IRuleType | string>('');
  protected ambitControl = new FormControl<IRuleAmbit | string>('');
  protected gazetteControl = new FormControl<IGazette | string>('');
  protected descControl = new FormControl<string>('');
  protected codeControl = new FormControl<string>('');
  protected internalControl = new FormControl<boolean | null>(false);
  protected repealedControl = new FormControl<boolean | null>(false);
  protected updateDateControl = new FormControl<Date | null>(null);
  protected enactmentDateControl = new FormControl<Date | null>(null);
  protected effectiveDateControl = new FormControl<Date | null>(null);
  protected ruleArticlesControl = new FormControl<IRuleIndex | null>(null);

  action: string | any;
  title: string | any;
  local_data: IRule | IMetadataSource; // TODO: Refactor and type 
  boeIndex: IRuleIndex[] | any; // TODO: Refactor and type

  protected boeRuleLocated = signal<boolean | null>(null);
  protected internalRuleLocated = signal<boolean | null>(null);

  //protected isLegalRule = new FormControl<boolean | null>(null);
  //protected ruleCodeControl = new FormControl<string>({value: '', disabled: !this.isLegalRule.value});
  //protected inBOE = new FormControl<boolean>({ value: false, disabled: !this.isLegalRule.value });
  private router = inject(Router)
  private route = inject(ActivatedRoute);


  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ruleService: LegislationService,
  ) {
  }
  ngOnInit(): void {
    this.locateRuleForm = new FormGroup({
      isLegalRule: new FormControl<boolean | null>(null),
      ruleCodeControl: new FormControl<string>({ value: '', disabled: true }),
    });

    this.getAmbits();
    this.getGazettes();
    this.getTypes();

    this.locateRuleForm.get('isLegalRule')?.valueChanges.pipe(
    ).subscribe((value: boolean) => {
      if (value)
        this.locateRuleForm.get('ruleCodeControl')?.enable();
      else this.locateRuleForm.get('ruleCodeControl')?.disable();
    });

    this.typeControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredTypes.set(this._filterTypes(value || ''));
    });

    this.ambitControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredAmbits.set(this._filterAmbits(value || ''));
    });

    this.gazetteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredGazettes.set(this._filterGazettes(value || ''));
    });

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    //this.dialogRef.close({ event: 'Cancel' });
  }

  seachBoeRule() {
    let code: string = this.locateRuleForm.get('ruleCodeControl')?.value || '';
    this.ruleService.getMetadata({ ruleCode: code.trim() }).subscribe(source => {
      console.log("Get metadata: ", source)
      if (source?.id) {
        this.local_data = source as IRule;
        this.internalRuleLocated.set(true);
        this.boeRuleLocated.set(false);
        this.ruleArticlesControl.setValue((source as IRule).boeIndex && (source as IRule).boeIndex!.length > 0 ? (source as IRule).boeIndex![0] : null);
      } else {
        this.internalRuleLocated.set(false);
        this.boeRuleLocated.set(true);
        this.castToIRule(source as IMetadataSource);
        this.getRuleArticles();
      }

      //this.boeRuleLocated.set(true)
      this.openSnackBar('Norma localizada!', 'Close');

      this.setRuleFormFields();
      this.disableRuleFormFields();
    })
  }

  saveRule() {
    this.savingRule = true;
    console.log("Rule created: ", this.local_data as IRule)
    this.ruleService.createRule(this.local_data as IRule).subscribe({
      next: (data) => {
        console.log("Rule created: ", data)
        this.openSnackBar('Norma creada con éxito!', 'Close');
        this.goToRule();
      },
      error: (err) => {
        console.error('Error creating rule:', err);
        this.openSnackBar('Error al crear la norma. Inténtalo de nuevo.', 'Close');
      },
    });
  }

  setRuleFormFields() {
    let code: string = this.locateRuleForm.get('ruleCodeControl')?.value || '';

    this.descControl.setValue(this.local_data.description);
    this.codeControl.setValue(code.trim());
    this.typeControl.setValue(this.local_data.type);
    this.ambitControl.setValue(this.local_data.ambit);
    this.gazetteControl.setValue(this.local_data.gazette);
    this.internalControl.setValue(this.local_data.internal);
    this.repealedControl.setValue(this.local_data.repealed);
    this.updateDateControl.setValue(this.local_data.updateDate);
    this.enactmentDateControl.setValue(this.local_data.enactmentDate);
    this.effectiveDateControl.setValue(this.local_data.effectiveDate);
  }

  disableRuleFormFields() {
    this.descControl.disable();
    this.codeControl.disable();
    this.typeControl.disable();
    this.ambitControl.disable();
    this.gazetteControl.disable();
    this.internalControl.disable();
    this.repealedControl.disable();
    this.updateDateControl.disable();
    this.enactmentDateControl.disable();
    this.effectiveDateControl.disable();
    this.ruleArticlesControl.disable();
  }

  castToIRule(source: IMetadataSource) {
    let code: string = this.locateRuleForm.get('ruleCodeControl')?.value || '';
    this.local_data = {
      ...this.local_data,
      description: source.titulo,
      repealed: source.estatus_derogacion === 'S', // 'S' for Sí derogada (Repealed)
      code: code.trim(),

      // Dates
      updateDate: parseDate(source.fecha_actualizacion),
      enactmentDate: parseDate(source.fecha_disposicion),
      effectiveDate: parseDate(source.fecha_vigencia),
      type: {
        //code: source.rango.codigo,
        description: source.rango.texto,
      } as IRuleType,
      ambit: {
        //code: source.ambito.codigo,
        description: source.ambito.texto,
      } as IRuleAmbit,
      gazette: {
        description: source.diario,
      } as IGazette,
      repealDate: undefined,
      lastArticle: undefined,
      internal: false,
      articles: [],
      readingTime: undefined,
    }
  }

  getRuleArticles() {
    let code: string = this.locateRuleForm.get('ruleCodeControl')?.value || '';

    this.ruleService.getIndex({ ruleCode: code.trim() }).subscribe(articles => {
      console.log("Get articles: ", articles)
      if (articles && articles.length > 0) {
        this.local_data.boeIndex = articles;
        this.boeIndex = articles.filter(a => a.id?.startsWith('a'));
        console.log("Filtered articles: ", this.boeIndex);
      }
    });
  }

  private _filterAmbits(value: IRuleAmbit | string | null): IRuleAmbit[] {
    const filterValue = this._getFilterValue(value);
    return this.ambits().filter((item) => item.code.toLowerCase().includes(filterValue));
  }

  private _filterTypes(value: IRuleType | string | null): IRuleType[] {
    const filterValue = this._getFilterValue(value);
    return this.types().filter((item) => item.code.toLowerCase().includes(filterValue));
  }

  private _filterGazettes(value: IGazette | string | null): IGazette[] {
    const filterValue = this._getFilterValue(value);
    return this.gazettes().filter((item) => item.code.toLowerCase().includes(filterValue));
  }

  private _getFilterValue(value: IRuleAmbit | IRuleType | IGazette | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.code) {
      return value.code.toLowerCase();
    }
    return '';
  }

  displayEntityName = (entity: IRuleAmbit | IRuleType | IGazette | string | null): string => {
    return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };

  onTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IRuleType;
    this.selectedType.set(selected);
  }

  onAmbitSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IRuleAmbit;
    this.selectedAmbit.set(selected);
  }

  onGazetteSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IGazette;
    this.selectedGazettes.set(selected);
  }

  getTypes(): void {
    this.ruleService.getRuleTypes().subscribe({
      next: (data) => {
        data.unshift(this.allType)
        this.types.set(data);
        this.filteredTypes.set(data);
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  getAmbits(): void {
    this.ruleService.getRuleAmbits().subscribe({
      next: (data) => {
        data.unshift(this.allAmbit)
        this.ambits.set(data);
        this.filteredAmbits.set(data);
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  getGazettes(): void {
    this.ruleService.getRuleGazettes().subscribe({
      next: (data) => {
        data.unshift(this.allGazzete)
        this.gazettes.set(data);
        this.filteredGazettes.set(data);
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  goToRule() {
    let code: string = this.locateRuleForm.get('ruleCodeControl')?.value || '';
    
    this.savingRule = false;
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/modules/:ruleCode/details`
        .replace(':ruleCode', code.trim())
    ]);
  }

  allAmbit: IRuleAmbit = {
    id: 0,
    code: 'ALL',
    description: 'Todos'
  }

  allType: IRuleType = {
    id: 0,
    code: 'ALL',
    description: 'Todos'
  }

  allGazzete: IGazette = {
    id: 0,
    code: 'ALL',
    description: 'Todos'
  }
}
