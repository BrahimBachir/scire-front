import { Component, inject, input, Input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { FlashcardService } from 'src/app/services';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { FeatureType, IFlashcard, IncomingNavigableEntity } from 'src/app/common/models/interfaces';
import { AppReactionsComponent } from 'src/app/components/core/reactions/reactions.component';
import { AppBannersNoFiltersComponent } from 'src/app/components/generic/banners/no-filters/banner-no-filters.component';
import { MyOwnElementPipe } from 'src/app/common/pipe/my-own-element.pipe';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { CreateGenericElementDialogComponent } from '../../create-generic-element/create-generic-element-dialog/create-generic-element-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { AppElementNavigationComponent } from '../../element-navigation/element-navigation.component';
import { IElementAction, getElementActionByEntity } from 'src/app/common/data';

@Component({
  selector: 'app-flashcard-navigation',
  imports: [
    CommonModule,
    MatCardModule,
    MaterialModule,
    TranslateModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    AppReactionsComponent,
    MatDividerModule,
    AppBannersNoFiltersComponent,
    AppElementNavigationComponent,
    MyOwnElementPipe
  ],
  templateUrl: './flashcard-navigation.component.html',
  styleUrl: './flashcard-navigation.component.scss'
})
export class FlashcardNavigationComponent implements OnInit, OnChanges {

  private service = inject(FlashcardService)
  private snackBar = inject(MatSnackBar)
  private dialog = inject(MatDialog)

  featureType: FeatureType = 'FLASHCARD';
  bannerText: string = 'Por favor, seleccione, al menos, una norma y un artículo.';
  creationAction: IElementAction = getElementActionByEntity(this.featureType)!;


  @Input() ruleId!: number;
  @Input() articleId!: number;
  flashcard = signal<IFlashcard | null>(null);
  fromScreen = input<boolean>(false);

  navigationState: IncomingNavigableEntity = {
    item: { id: 0 },
    hasNext: false,
    hasPrevious: false,
  };

  isFlipped: boolean = false;
  entityToCreate = output<string>();

  ngOnInit(): void {
    if (this.articleId) {
      this.isFlipped = false;
      this.goNext();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.articleId) {
      this.isFlipped = false;
      this.goNext();
    }
    else this.flashcard.set(null);
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  create() {
    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
      data: {
        action: 'CREAR',
        feature: this.featureType,
        rule: {
          isEditable: true,
          element: null
        },
        article: {
          isEditable: false,
          element: null
        },
        element: null
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.articleId)
        this.goNext();
    });
  }

  deleteItem() {
    this.isFlipped = false;
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(this.flashcard()?.id || 0).subscribe({
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
    this.isFlipped = false;
    const fc = this.flashcard();
    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
      data: {
        action: 'EDITAR',
        feature: this.featureType,
        rule: {
          isEditable: false,
          element: fc?.rule
        },
        article: {
          isEditable: false,
          element: fc?.article
        },
        element: this.flashcard()
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

  createElement(type: string) {
    this.entityToCreate.emit(type);
  }

  goNext() {
    this.service.navigate(this.articleId, { flashcardId: this.navigationState.nextId! })
      .subscribe(res => {
        this.flashcard.set(res.item as IFlashcard);
        this.navigationState = res;
      });
  }

  goPrevious() {
    this.service.navigate(this.articleId, { flashcardId: this.navigationState.previousId! })
      .subscribe(res => {
        this.flashcard.set(res.item as IFlashcard);
        this.navigationState = res;
      });
  }
}
