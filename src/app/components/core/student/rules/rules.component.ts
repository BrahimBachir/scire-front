import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LegislationService } from 'src/app/services';
import { IRule, IRuleType, IRuleAmbit, IGazette } from 'src/app/common/models/interfaces';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ControlAccessPipe } from 'src/app/common/pipe/actions-access.pipe';

@Component({
  selector: 'app-courses',
  templateUrl: './rules.component.html',
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
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocomplete,
    ControlAccessPipe,
  ],
  styleUrl: 'rules.component.scss'
})
export class AppRulesComponent implements OnInit {
  editRule(_t98: IRule) {
    throw new Error('Method not implemented.');
  }
  deleteRule(arg0: number) {
    throw new Error('Method not implemented.');
  }
  createRule() {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/modules/create`]);
  }
  private legislationService = inject(LegislationService)
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  goToRoute(rule: IRule) {
    console.log(rule)
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/modules/:ruleCode/details`.replace(':ruleCode', rule.code)]);
  }
  protected rules = signal<IRule[]>([]);
  protected filteredRules = signal<IRule[]>([]);
  protected selectedRule = signal<IRule | null>(null);

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
  protected searchControl = new FormControl<string>('');

  filterForm!: FormGroup;

  /*  constructor(
     private legislationService: LegislationService
   ) { } */

  ngOnInit(): void {
    this.getAmbits();
    this.getGazettes();
    this.getTypes();
    this.getRules();

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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredRules.set(this.filter(filterValue));
  }

  filter(value: string): IRule[] {
    return this.rules()
      .filter(
        (r) => r.description.toLowerCase().indexOf(value.toLowerCase()) !== -1 || r.code.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
  }

  getTypes(): void {
    this.legislationService.getRuleTypes().subscribe({
      next: (data) => {
        data.unshift(this.allType)
        this.types.set(data);
        this.filteredTypes.set(data);
        console.log("Types loaded: ", this.filteredTypes())
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  getAmbits(): void {
    this.legislationService.getRuleAmbits().subscribe({
      next: (data) => {
        data.unshift(this.allAmbit)
        this.ambits.set(data);
        this.filteredAmbits.set(data);
        console.log("Ambits loaded: ", this.filteredAmbits())
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  getGazettes(): void {
    this.legislationService.getRuleGazettes().subscribe({
      next: (data) => {
        data.unshift(this.allGazzete)
        this.gazettes.set(data);
        this.filteredGazettes.set(data);
        console.log("Gazette loaded: ", this.filteredGazettes())
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  getRules(): void {
    this.legislationService.getRules().subscribe({
      next: (data) => {
        this.rules.set(data);
        this.filteredRules.set(data);
        console.log("Rules loaded: ", this.filteredRules())
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
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

  displayEntityName = (entity: IRuleAmbit | IRuleType | IGazette | string | null): string => {
    return (entity && typeof entity !== 'string' && entity.description) ? entity.description : (entity as string || '');
  };

  onTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IRuleType;
    this.selectedType.set(selected);
    console.log('Selected type:', selected);
    if (selected.code === 'ALL') {
      this.filteredRules.set(this.rules());
    } else {
      this.filteredRules.set(
        this.rules()
          .filter((rule) => rule.type?.code === selected.code)
      );
    }
  }

  onAmbitSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IRuleAmbit;
    this.selectedAmbit.set(selected);
    console.log('Selected ambit:', selected);
    if (selected.code === 'ALL') {
      this.filteredRules.set(this.rules());
    } else {
      this.filteredRules.set(
        this.rules()
          .filter((rule) => rule.ambit?.code === selected.code)
      );
    }
  }

  onGazetteSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IGazette;
    this.selectedGazettes.set(selected);
    console.log('Selected gazette:', selected);
    if (selected.code === 'ALL') {
      this.filteredRules.set(this.rules());
    } else {
      this.filteredRules.set(
        this.rules()
          .filter((rule) => rule.gazette?.code === selected.code)
      );
    }
  }

  ddlChange(ob: any, type: string): void {
    const filterValue = ob.value;
    if (filterValue === 'All') {
      this.filteredRules.set(this.rules());
    } else {
      this.filteredRules.set(
        this.rules()
          .filter((rule) => rule.gazette?.code === filterValue)
      );
    }
  }

  allRule: IRule = {
    id: 0,
    code: 'ALL',
    description: 'Todas'
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
