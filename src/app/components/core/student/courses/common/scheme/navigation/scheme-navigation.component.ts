import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, inject, Input, OnChanges, OnInit, output, Renderer2, signal, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SchemeService } from 'src/app/services';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MermaidService } from 'src/app/services/mermaid.service';
import { MermaidPanZoomDirective } from 'src/app/common/directives/mermaid-pan-zoom.directive';
import { FeatureType, IncomingNavigableEntity, IScheme } from 'src/app/common/models/interfaces';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';
import { AppBannersLevelUpComponent } from 'src/app/components/generic/banners/level-up/banner-level-up.component';
import { AppElementNavigationComponent } from '../../element-navigation/element-navigation.component';
import { IElementAction, getElementActionByEntity } from 'src/app/common/data';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyOwnElementPipe } from 'src/app/common/pipe/my-own-element.pipe';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { setSelectedScheme } from 'src/app/common/store/actions';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-scheme-navigation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    AppBannersLevelUpComponent,
    AppElementNavigationComponent,
    AppReactionsComponent,
    TablerIconsModule,
    MermaidPanZoomDirective,
    MyOwnElementPipe
  ],
  templateUrl: './scheme-navigation.component.html',
  styleUrl: './scheme-navigation.component.scss'
})
export class SchemeNavigationComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store<AppState>);
  private activatedRouter = inject(ActivatedRoute);

  featureType: FeatureType = 'SCHEME';

  @ViewChild('mermaid', { static: false })
  mermaid!: ElementRef<HTMLDivElement>;

  @ViewChild(MermaidPanZoomDirective)
  panZoom!: MermaidPanZoomDirective;
  entityToCreate = output<string>();
  courseId: number = 0;

  creationAction: IElementAction = getElementActionByEntity('DIAGRAM')!;

  bannerText = 'Has alcanzado el máximo de diagramas configurados para tu plan. Aumenta tus posibilidades de aprobar la oposición subiendo al siguiente nive!'

  private service = inject(SchemeService)
  private mermaidService = inject(MermaidService)
  private renderer = inject(Renderer2)
  @Input() ruleId!: number;
  @Input() articleId!: number;

  constructor() {
    this.courseId = Number(this.activatedRouter?.snapshot?.paramMap?.get('courseId')) || 0;

  }

  currentIndex: number = 0;
  selectedScheme = signal<IScheme | null>(null);
  isFlipped: boolean = false;
  selectedTopicId: number = 0;
  rapidPageValue = '';
  svg = "#";
  id = 0;
  zoomLevel: number = 1;
  isDragging: boolean = false;
  showBanner: boolean = false;
  startX: number = 0;
  startY: number = 0;
  currentTranslateX: number = 0;
  currentTranslateY: number = 0;

  navigationState: IncomingNavigableEntity = {
    item: { id: 0 },
    hasNext: false,
    hasPrevious: false,
  };


  schemes: IScheme[] = [];

  ngOnInit(): void {
    if (this.articleId)
      this.goNext()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.articleId)
      this.goNext();
    else this.selectedScheme.set(null);
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
      console.error('Mermaid render blocked:', e);
    }
  }

  async update() {
    const currentSnippet = this.selectedScheme()?.snippet;
    if (currentSnippet) {
      this.rapidPageValue = currentSnippet;
      this.zoomLevel = 1;
      setTimeout(() => {
        this.renderDiagram();
      }, 1000);
    }
  }

  createElement(type: string) {
    this.entityToCreate.emit(type);
  }

  goNext() {
    this.service.navigate(this.articleId, { schemeId: this.navigationState.nextId! })
      .subscribe(res => {
        this.selectedScheme.set(res.item as IScheme);
        console.log(res)
        this.navigationState = res;
        this.update();
      });
  }

  goPrevious() {
    this.service.navigate(this.articleId, { schemeId: this.navigationState.previousId! })
      .subscribe(res => {
        this.selectedScheme.set(res.item as IScheme);
        console.log(res)
        this.navigationState = res;
        this.update();
      });
  }

  deleteItem() {
    this.isFlipped = false;
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(this.selectedScheme()?.id || 0).subscribe({
          next: (res) => {
            this.goNext();
            this.showSnackbar(res.message);
          },
          //error: (error) => console.error(error)
        })
      }
    });
  }

  updateItem() {
    const scheme = this.selectedScheme();
    const id: string = scheme?.id?.toString() || '';
    if (scheme) {
      this.store.dispatch(setSelectedScheme(scheme))
      this.router.navigate([`${this.activatedRouter?.snapshot.data['role'].toLowerCase()}/schemes/:schemeId/edit`.replace(':schemeId', id)]);
    }
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
