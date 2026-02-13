import { Component, effect, inject, Input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CreateGenericElementDialogComponent } from './create-generic-element-dialog/create-generic-element-dialog.component';
import { IRule, IArticle, IFieldMode } from 'src/app/common/models/interfaces';
import { ADD_ELEMENTS_ACTIONS } from 'src/app/common/data';
import { Router, ActivatedRoute } from '@angular/router';
import { IconModule } from 'src/app/icon/icon.module';
import { AIDialogComponent } from '../ai-element/ai-dialog/ai-dialog.component';
import { PlanFilterPipe } from "../../../../../../common/pipe/plan-filter.pipe";
import { VideoDialogComponent } from '../video/dialog/video-dialog.component';
@Component({
  selector: 'app-create-generic-element',
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    IconModule,
    MatDividerModule,
    MatTooltipModule,
    PlanFilterPipe
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
  ) {
    this.courseId = Number(activatedRouter?.snapshot?.paramMap?.get('courseId')) || 0;

    effect(() => {
      const entity = this.entityToCreate();

      if (entity) {
        this.openDialog(entity);
      }
    })
  }

  openDialog(feature: string) {
    if (feature === 'DIAGRAM') {
      this.createDiagram();
      return;
    }

    if (feature === 'AI') {
      this.createAIElement();
      return
    }

    if (feature === 'VIDEO') {
      this.createVideo();
      return
    }


    this.featureToCreate = feature;
    console.log("Feature to create: ", feature)
    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
      width: '900px',
      data: {
        action: 'CREAR',
        mode: 'CREATING',
        ruleId: this.rule.id,
        feature,
        //rule: this.rule,
        articlesIds: this.article ? [this.article.id] : [],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("Result: ", result)
    });
  }

  createDiagram() {
    this.router.navigate([`${this.activatedRouter?.snapshot.data['role'].toLowerCase()}/diagrams/create`], {
      state: {
        ruleId: this.rule.id,
        articlesIds: [this.article?.id],
        mode: 'CREATING'
      }
    });
  }

  createAIElement() {
    const dialogRef = this.dialog.open(AIDialogComponent, {
      width: '900px',
      data: {
        ruleId: this.rule?.id,
        articlesIds: this.article ? [this.article.id] : [],
      },
    });

    dialogRef.afterClosed().subscribe((diagram) => {
      if(diagram && diagram.snippet)
        this.router.navigate([`${this.activatedRouter?.snapshot.data['role'].toLowerCase()}/diagrams/create`], {
          state: {
            ruleId: diagram.ruleId,
            articlesIds: [diagram.articlesIds],
            mode: 'CREATING',
            element: diagram,
            fromAI: true
          }
        });
    });
  }

  createVideo(){    
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      width: '900px',
      data: {
        ruleId: this.rule?.id,
        mode: 'CREATING',
        articleId: this.article?.id,
      },
    });

    dialogRef.afterClosed().subscribe((video) => {
      console.log(video);
    });
  }

}
