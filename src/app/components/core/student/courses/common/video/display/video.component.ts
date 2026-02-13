import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, inject, input, Input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { TablerIconComponent } from 'angular-tabler-icons';
import { getElementActionByEntity, IElementAction } from 'src/app/common/data';
import { FeatureType, IncomingNavigableEntity, IVideo } from 'src/app/common/models/interfaces';
import { VideoService } from 'src/app/services/video.service';
import { AppElementNavigationComponent } from '../../element-navigation/element-navigation.component';
import { MyOwnContentPipe } from 'src/app/common/pipe/my-own-content.pipe';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateGenericElementDialogComponent } from '../../create-generic-element/create-generic-element-dialog/create-generic-element-dialog.component';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MatDividerModule } from '@angular/material/divider';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';
import { AppBannersNoFiltersComponent } from 'src/app/components/generic/banners/no-filters/banner-no-filters.component';
import { VideoDialogComponent } from '../dialog/video-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video',
  imports: [
    CommonModule,
    YouTubePlayerModule,
    TablerIconComponent,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    AppElementNavigationComponent,
    IconModule,
    AppReactionsComponent,
    MatDividerModule,
    AppBannersNoFiltersComponent,
    MyOwnContentPipe,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit, OnChanges {
  private service = inject(VideoService)
  private breakpointObserver = inject(BreakpointObserver);
  private snackBar = inject(MatSnackBar)
  private dialog = inject(MatDialog)

  @Input() ruleId!: number;
  @Input() articleId!: number;
  video = signal<IVideo | null>(null);
  fromScreen = input<boolean>(false);

  entityToCreate = output<string>();
  featureType: FeatureType = 'VIDEO';
  bannerText: string = 'Por favor, seleccione, al menos, una norma y un artículo.';

  videoWidth = 650;
  videoHeight = this.videoWidth * 0.5625;

  creationAction: IElementAction = getElementActionByEntity('VIDEO')!;



  navigationState: IncomingNavigableEntity = {
    item: { id: 0 },
    hasNext: false,
    hasPrevious: false,
  };

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).subscribe(result => {
      this.calculateDimensions();
    });

    if (this.articleId) {
      this.goNext();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.articleId) {
      this.goNext();
    }
    else this.video.set(null);
  }

  calculateDimensions() {
    const screenWidth = window.innerWidth;
    this.videoWidth = Math.min(screenWidth * 0.8, 1200);
    this.videoHeight = this.videoWidth * 0.5625; // Maintain 16:9
  }

  createElement(type: string) {
    this.entityToCreate.emit(type);
  }

  goNext() {
    this.service.navigate(this.articleId, { videoId: this.navigationState.nextId! })
      .subscribe(res => {
        this.video.set(res.item as IVideo);
        this.navigationState = res;
      });
  }

  goPrevious() {
    this.service.navigate(this.articleId, { videoId: this.navigationState.previousId! })
      .subscribe(res => {
        this.video.set(res.item as IVideo);
        this.navigationState = res;
      });
  }

  create() {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      width: '900px',
      data: {
        ruleId: this.ruleId,
        mode: 'CREATING',
        articleId: this.articleId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.articleId)
        this.goNext();
    });
  }

  // TODO: Decide the back logig of deleting video. ¿The video or only the relation with the article

  deleteItem() {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(this.video()?.id || 0).subscribe({
          next: (res) => {
            this.goNext();
            this.showSnackbar(res.message);
          },
          //error: (error) => console.error(error)
        })
      }
    });
  }

  // TODO: Unable to edit video
  updateItem() {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      data: {
        action: 'EDITAR',
        feature: this.featureType,
        ruleId: this.video()?.ruleId,
        articlesIds: this.video()?.articlesIds,
        element: this.video()
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.goNext();
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
