import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, inject, Injector, Input, OnChanges, OnInit, Output, Renderer2, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IRule, IArticle, IScheme, IFieldMode, FeatureType, CREATE_STRATEGY_MAP, GenericFeatureType } from 'src/app/common/models/interfaces';
import { MaterialModule } from 'src/app/material.module';
import { SchemeService } from 'src/app/services';
import { CalendarCommonModule } from "angular-calendar";
import { DiagramsSamples } from 'src/app/common/data';
import { capitalizeFirstLetter } from 'src/app/common/utils/capitalize-first-letter.util';
import { MermaidPanZoomDirective } from 'src/app/common/directives/mermaid-pan-zoom.directive';
import { MermaidService } from 'src/app/services/mermaid.service';
import { RuleFilterComponent } from 'src/app/components/generic/filters/rule/rule-filter.component';
import { AppMultiSelectComponent } from 'src/app/components/generic/reusable/multi-select/multi-select.component';
import { Router } from '@angular/router';
import { startWith, debounceTime, takeUntil, Subject, finalize } from "rxjs";
import { FeatureStrategy } from 'src/app/strategies';
import { SchemeStrategy } from 'src/app/strategies/scheme.strategy';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { getSelectedRule, getSelectedScheme } from 'src/app/common/store/selectors/learning.selectors';

interface ISchemeState {
  ruleId?: number;
  articlesIds?: number[];
  scheme?: IScheme;
  mode?: IFieldMode
}

@Component({
  selector: 'app-scheme-create-edit',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    TablerIconsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    CalendarCommonModule,
    MermaidPanZoomDirective,
    RuleFilterComponent,
    AppMultiSelectComponent
  ],
  templateUrl: './scheme-form.component.html',
  styleUrl: './scheme-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SchemeStrategy
  ]
})
export class SchemeFormComponent implements OnInit, OnChanges {
  private renderer = inject(Renderer2)
  private store = inject(Store<AppState>);
  private mermaidService = inject(MermaidService)
  private injector = inject(Injector);
  private router = inject(Router);

  selectedItem = signal<IScheme | null>(null);
  private destroy$ = new Subject<void>();
  selectedRule: IRule | null = null;
  loading = signal<boolean>(false);
  errorLabel = signal<string | null>(null);
  error = signal<boolean>(false);


  mode: IFieldMode = 'CREATING';
  feature: GenericFeatureType = 'SCHEME';
  strategy!: FeatureStrategy;

  form!: FormGroup;
  rule = signal<IRule | null>(null);
  diagramForm!: FormGroup;

  samples: IScheme[] = DiagramsSamples

  @ViewChild('mermaid', { static: false })
  mermaid!: ElementRef<HTMLDivElement>;

  @ViewChild(MermaidPanZoomDirective)
  panZoom!: MermaidPanZoomDirective;
  rapidPageValue = '';
  svg = "#";
  id = 0;
  zoomLevel: number = 1;

  constructor() {
    const currentUrl = this.router.url;

    const Strategy = CREATE_STRATEGY_MAP.get(this.feature)!;
    this.strategy = this.injector.get(Strategy);
    const state = this.router.currentNavigation()?.extras.state as ISchemeState;
    console.log("State: ", this.router.currentNavigation())
    if (state && state.mode)
      this.mode = state.mode;
    console.log("Mode: ", this.mode)

    if (currentUrl.includes('create'))
      this.buildCreatingForm(state);
    else
      this.buildEditingForm();

  }

  ngOnInit(): void {

    this.store.select(getSelectedRule).pipe(takeUntil(this.destroy$)).subscribe(rule => {
      this.selectedRule = rule ?? null;

      const articlesCtrl = (this.form.get('common.articlesIds') as FormControl<number[]>);
      const ruleCtrl = (this.form.get('common.ruleId') as FormControl<number[]>);

      if (!rule) {
        articlesCtrl.setValue([], { emitEvent: false });
        articlesCtrl.disable({ emitEvent: false });
      } else {
        articlesCtrl.enable({ emitEvent: false });
        ruleCtrl.disable({ emitEvent: false })
      }
    });

    this.submit = () => {
      this.loading.set(true);
      this.errorLabel.set(null);
      const commonForm = this.form.get('common') as FormGroup;
      const featureForm = this.form.get('feature') as FormGroup;

      console.log("Saving", commonForm)
      const ruleCtrl = commonForm.get('ruleId') as FormControl<number | null>;
      const articlesCtrl = commonForm.get('articlesIds') as FormControl<number[]>;

      // disable initially if no rule
      if (!ruleCtrl.value) {
        articlesCtrl.disable({ emitEvent: false });
      }

      ruleCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(ruleId => {
        if (!ruleId) {
          // rule cleared → wipe and disable articles
          this.selectedRule = null;
          articlesCtrl.setValue([], { emitEvent: false });
          articlesCtrl.disable({ emitEvent: false });
          return;
        }

        articlesCtrl.enable({ emitEvent: false });

        articlesCtrl.setValue([], { emitEvent: false });
      });

      this.strategy.submit(featureForm, commonForm)
        .pipe(finalize(() => {
          this.loading.set(false);
          this.error.set(false);
        }))
        .subscribe({
          next: result => console.log(result),
          error: (error) => {
            this.loading.set(false)
            this.error.set(true);
            this.errorLabel.set('Error al guardar la pregunta');
            console.log(error, this.loading, this.error, this.errorLabel)
          }
        });
      };

      const snippet = this.form.get('feature.snippet') as FormControl<string>;

        snippet.valueChanges.pipe(
          startWith(''),
          debounceTime(200),
        ).subscribe(value => {
          console.log(value)
          this.updateRender();
        });
  }

  buildCreatingForm(state: ISchemeState) {
    console.log("State at creating form: ", state)
    this.form = new FormGroup({
      common: new FormGroup({
        ruleId: new FormControl(state?.ruleId ?? null, Validators.required),
        articlesIds: new FormControl(state?.articlesIds ? state.articlesIds : [], Validators.required),
      }),
      feature: this.strategy.buildForm()
    });
  }

  buildEditingForm() {
    this.store.select(getSelectedScheme).subscribe((scheme) => {
      this.form = new FormGroup({
        common: new FormGroup({
          ruleId: new FormControl(scheme?.ruleId ?? null, Validators.required),
          articlesIds: new FormControl(scheme?.articlesIds ? scheme.articlesIds : [], Validators.required),
        }),
        feature: this.strategy.buildForm(scheme as IScheme)
      });
      this.updateRender();
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }

  capitalizeFirstLetter(key: string): string {
    return capitalizeFirstLetter(key);
  }

  changeSample(sample: IScheme) {
    this.form.get('feature.snippet')?.setValue(sample.snippet || '');
    //this.snippet.set(sample.snippet || '');
    this.updateRender();
  }

  private async renderDiagram() {
    try {
      const svg = await this.mermaidService.render(
        `diagram-${this.id++}`,
        this.rapidPageValue
      );

      this.renderer.setProperty(this.mermaid.nativeElement, 'innerHTML', svg);

      // Reset zoom AFTER new SVG is injected
      queueMicrotask(() => this.panZoom?.reset());

    } catch (e) {
      //console.error('Mermaid render blocked:', e);
    }
  }

  async updateRender() {
    const currentSnippet = this.form.get('feature.snippet')?.value;
    if (currentSnippet) {
      this.rapidPageValue = currentSnippet;
      this.zoomLevel = 1;
      setTimeout(() => {
        this.renderDiagram();
      }, 500);
    }
  }

  async updateDiagram() {
    this.updateRender();
  }


  submit!: () => void;
}
