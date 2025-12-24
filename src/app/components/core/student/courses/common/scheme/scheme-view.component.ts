import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, inject, Input, OnChanges, OnInit, Renderer2, signal, SimpleChanges, ViewChild } from '@angular/core';
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
import { FeatureType, IScheme } from 'src/app/common/models/interfaces';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';
import { AppBannersLevelUpComponent } from 'src/app/components/generic/banners/level-up/banner-level-up.component';

@Component({
  selector: 'app-scheme-view',
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
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    AppBannersLevelUpComponent,
    AppReactionsComponent,
    TablerIconsModule,
    MermaidPanZoomDirective
  ],
  templateUrl: './scheme-view.component.html',
  styleUrl: './scheme-view.component.scss'
})
export class SchemeViewComponent implements OnInit, OnChanges {
  featureType: FeatureType = 'SCHEME';
  @ViewChild('mermaid', { static: false })
  mermaid!: ElementRef<HTMLDivElement>;

  @ViewChild(MermaidPanZoomDirective)
  panZoom!: MermaidPanZoomDirective;



  bannerText = 'Has alcanzado el máximo de diagramas configurados para tu plan. Aumenta tus posibilidades de aprobar la oposición subiendo al siguiente nive!'

  private service = inject(SchemeService)
  private mermaidService = inject(MermaidService)
  private renderer = inject(Renderer2)
  @Input() ruleCode!: string;
  @Input() artiCode!: string;

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
  direction: string = 'FORWARD';


  schemes: IScheme[] = [];

  ngOnInit(): void {
    this.getScheme();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
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

  getNext() {
    this.direction = 'FORWARD';
    this.getScheme();
  }

  getPrevious() {
    this.direction = 'BACKWARD';
    this.getScheme();
  }

  getScheme() {
    this.service.navigate(this.ruleCode, this.artiCode, { schemeId: this.selectedScheme()?.id || 0, direction: this.direction }).subscribe({
      next: (data) => {
        this.selectedScheme.set(data);
        this.update();
      },
      error: (error) => {
        if (error.error.errorCode === 'ERROR_999')
          this.showBanner = true;
      }
    })
  }
}
