import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CreateGenericElementDialogComponent } from './create-generic-element-dialog/create-generic-element-dialog.component';
import { IRule, IArticle } from 'src/app/common/models/interfaces';
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
  @Input() article!: IArticle;

  private dialog = inject(MatDialog)

  featureToCreate: string = '';

  openDialog(feature: string) {
    this.featureToCreate = feature;
    console.log("Selected feature: ",this.featureToCreate)

    const dialogRef = this.dialog.open(CreateGenericElementDialogComponent, {
          data: {feature, rule: this.rule, article: this.article},
          //autoFocus: true, 
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          console.log("Resultado del cierre del diálogo: ",result)
        });
  }

}
