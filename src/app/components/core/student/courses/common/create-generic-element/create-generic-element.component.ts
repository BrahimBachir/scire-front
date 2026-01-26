import { Component, effect, inject, Input, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CreateGenericElementDialogComponent } from './create-generic-element-dialog/create-generic-element-dialog.component';
import { IRule, IArticle, IFieldMode } from 'src/app/common/models/interfaces';
import { ADD_ELEMENTS_ACTIONS } from 'src/app/common/data';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-create-generic-element',
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    TablerIconsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './create-generic-element.component.html',
  styleUrl: './create-generic-element.component.scss'

})
export class AppCreateGenericElementComponent {
  @Input() rule!: IRule;
  @Input() article!: IArticle | null;
  entityToCreate = model<string>('');
  mode: IFieldMode = 'CREATING';

  courseId: number = 0;
  addElementsActions = ADD_ELEMENTS_ACTIONS;

  private dialog = inject(MatDialog)

  featureToCreate: string = '';

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
  ){
      this.courseId = Number(activatedRouter?.snapshot?.paramMap?.get('courseId')) || 0;

    effect(() => {
      const entity = this.entityToCreate();
      
      if (entity) {
        this.openDialog(entity);
      }
    })
  }

  openDialog(feature: string) {
    if(feature === 'DIAGRAM'){
      this.createDiagram();
      return;
    }

    this.featureToCreate = feature;
    console.log("Feature to create: ", feature)
    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
      width: '900px',
      data: {
        action: 'CREAR',
        mode: 'CREATING',
        feature,
        rule: this.rule,
        articlesIds: this.article ? [this.article.id] : [],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  createDiagram() {
    this.router.navigate([`${this.activatedRouter?.snapshot.data['role'].toLowerCase()}/courses/:courseId/schemes/create`.replace(':courseId', this.courseId.toString())],{ 
      state: { 
        rule: this.rule.id,
        articlesIds: [this.article?.id],
        //schema: selectedScheme
        mode: 'CREATING'
      } 
    });
  }

}
