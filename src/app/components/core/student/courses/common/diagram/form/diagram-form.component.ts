import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from 'src/app/material.module';
import { CalendarCommonModule } from "angular-calendar";
import { DiagramsSamples } from 'src/app/common/data';
import { capitalizeFirstLetter } from 'src/app/common/utils/capitalize-first-letter.util';
import { MermaidPanZoomDirective } from 'src/app/common/directives/mermaid-pan-zoom.directive';
import { MermaidService } from 'src/app/services/mermaid.service';
import { RuleFilterComponent } from 'src/app/components/generic/filters/rule/rule-filter.component';
import { AppMultiSelectComponent } from 'src/app/components/generic/reusable/multi-select/multi-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, debounceTime, takeUntil, Subject, finalize, Subscription } from "rxjs";
import { DiagramStrategy } from 'src/app/strategies/diagram.strategy';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { getAllSelectedArticles, getSelectedRule, getSelectedDiagram } from 'src/app/common/store/selectors/learning.selectors';
import { Component, ChangeDetectionStrategy, OnInit, OnChanges, inject, Renderer2, signal, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { IDiagram, IFieldMode, IRule, GenericFeatureType, CreateDialogData } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { DiagramService } from 'src/app/services';

interface IDiagramState {
  ruleId?: number;
  articlesIds?: number[];
  diagram?: IDiagram;
  mode?: IFieldMode
}

@Component({
  selector: 'app-diagram-create-edit',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    IconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    CalendarCommonModule,
    MermaidPanZoomDirective,
    RuleFilterComponent,
    AppMultiSelectComponent
  ],
  templateUrl: './diagram-form.component.html',
  styleUrl: './diagram-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DiagramStrategy
  ]
})
export class DiagramFormComponent implements OnInit, OnChanges {
  private renderer = inject(Renderer2)
  private store = inject(Store<AppState>);
  private mermaidService = inject(MermaidService)
  private router = inject(Router);
  private activatedRouter = inject(ActivatedRoute);
  private service = inject(DiagramService);

  private sub?: Subscription;

  selectedItem = signal<IDiagram | null>(null);
  selectedDiagram: IDiagram;
  private destroy$ = new Subject<void>();
  loading = signal<boolean>(false);
  loaded = signal<boolean>(false);
  errorLabel = signal<string | null>(null);
  error = signal<boolean>(false);

  diagramId: number = 0;
  private navigationState: CreateDialogData | undefined;

  mode: IFieldMode = 'CREATING';
  feature: GenericFeatureType = 'DIAGRAM';

  form!: FormGroup;
  rule = signal<IRule | null>(null);
  diagramForm!: FormGroup;

  samples: IDiagram[] = DiagramsSamples

  @ViewChild('mermaid', { static: false })
  mermaid!: ElementRef<HTMLDivElement>;

  @ViewChild(MermaidPanZoomDirective)
  panZoom!: MermaidPanZoomDirective;
  rapidPageValue = '';
  svg = "#";
  id = 0;
  zoomLevel: number = 1;

  constructor(
    private strategy: DiagramStrategy
  ) {
    this.form = this.strategy.buildForm();
    this.diagramId = Number(this.activatedRouter?.snapshot?.paramMap?.get('diagramId')) || 0;

    const navigation = this.router.currentNavigation();
    const state = navigation?.extras.state as CreateDialogData;
    this.navigationState = state;

    if (state && state.fromAI) {
      this.selectedDiagram = state.element as IDiagram;
      this.patchForm()
      this.selectedItem.set(state.element as IDiagram);
      this.loaded.set(true);
      this.updateRender();
    }

    const currentUrl = this.router.url;
    if (currentUrl.includes('create'))
      this.mode = 'CREATING';
    else
      this.mode = 'EDITING'

  }

  ngOnInit(): void {
    console.log(this.mode)
    if (this.mode === 'CREATING') {
      if (this.navigationState?.ruleId) {
        this.form.get('ruleId')?.setValue(this.navigationState.ruleId);
      } else {
        this.store.select(getSelectedRule).pipe(takeUntil(this.destroy$)).subscribe(rule => {
          if (rule) {
            this.form.get('ruleId')?.setValue(rule.id);
          }
        });
      }

      if (this.navigationState?.articlesIds?.length) {
        this.form.get('articlesIds')?.setValue(this.navigationState.articlesIds);
      } else {
        this.store.select(getAllSelectedArticles).pipe(takeUntil(this.destroy$)).subscribe(ids => {
          if (ids)
            this.form.get('articlesIds')?.setValue(ids);
        });
      }
      this.loaded.set(true);
    } else {
      this.loadItem();
    }

    this.form.get('ruleId')?.disable({ emitEvent: false });


    this.submit = () => {
      this.loading.set(true);
      this.errorLabel.set(null);

      this.strategy.submit(this.form)
        .pipe(finalize(() => {
          this.loading.set(false);
          this.error.set(false);
        }))
        .subscribe({
          next: result => console.log(result),
          error: (error) => {
            this.loading.set(false)
            this.error.set(true);
            this.errorLabel.set('Error al guardarel esquema');
            console.log(error, this.loading, this.error, this.errorLabel)
          }
        });
    };

    const snippet = this.form.get('snippet') as FormControl<string>;

    snippet.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      console.log(value)
      this.updateRender();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  capitalizeFirstLetter(key: string): string {
    return capitalizeFirstLetter(key);
  }

  changeSample(sample: IDiagram) {
    this.form.get('snippet')?.setValue(sample.snippet || '');
    this.updateRender();
  }

  private async renderDiagram() {
    try {
      const svg = await this.mermaidService.render(
        `diagram-${this.id++}`,
        this.rapidPageValue
      );

      this.renderer.setProperty(this.mermaid.nativeElement, 'innerHTML', svg);

      queueMicrotask(() => this.panZoom?.reset());

    } catch (e) {
      //console.error('Mermaid render blocked:', e);
    }
  }

  async updateRender() {
    const currentSnippet = this.form.get('snippet')?.value;
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

  loadItem() {
    this.service.getOne(this.diagramId)
      .pipe(finalize(() => {
        this.loading.set(false);
        this.error.set(false);
        this.loaded.set(true);
      }))
      .subscribe({
        next: (diagram) => {
          console.log("Diagram: from backend: ", diagram)
          this.selectedItem.set(diagram);
          this.selectedDiagram = diagram;
          this.patchForm()
        },
        error: (error) => console.error(error)
      });
  }

  patchForm() {
    this.form.get('id')?.setValue(this.selectedDiagram?.id);
    this.form.get('snippet')?.setValue(this.selectedDiagram?.snippet);
    this.form.get('description')?.setValue(this.selectedDiagram?.description);
    this.form.get('ruleId')?.setValue(this.selectedDiagram?.ruleId);
    this.form.get('articlesIds')?.setValue(this.selectedDiagram?.articlesIds);
    this.form.get('creationTypeId')?.setValue(this.selectedDiagram?.creationTypeId);
    console.log("Form", this.form.value)
  }
}
