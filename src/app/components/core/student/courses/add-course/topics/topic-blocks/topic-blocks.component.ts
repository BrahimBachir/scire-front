import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CreateDialogData, ITopic, IFieldMode } from 'src/app/common/models/interfaces';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { IconModule } from 'src/app/icon/icon.module';
import { TopicStrategy } from 'src/app/strategies';
import { TopicCategoryFilterComponent } from "src/app/components/generic/filters/topic-category/topic-category-filter.component";
import { TopicSectionFilterComponent } from "src/app/components/generic/filters/topic-section/topic-section-filter.component";
import { TopicFilterComponent } from "src/app/components/generic/filters/topic/topic-filter.component";
import { BlockFormComponent } from '../blocks/block-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService, TopicService } from 'src/app/services';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topic-blocks',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IconModule,
    TopicCategoryFilterComponent,
    TopicSectionFilterComponent,
    MatTooltipModule,
  ],
  templateUrl: './topic-blocks.component.html',
  styleUrl: './topic-blocks.component.scss',
  providers: [
    TopicStrategy
  ]
})
export class TopicBlocksComponent {
  private service = inject(TopicService);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToastrService);

  topicId = Number(this.route.snapshot.paramMap.get('topicId')) || null;

  form!: FormGroup;
  loading = false;
  error: string | null = null;
  blocksComponent = BlockFormComponent;

  constructor(
    private strategy: TopicStrategy,
  ) { }

  ngOnInit() {
    this.getItem()

    this.submit = () => {
      this.loading = true;
      this.error = null;

      this.strategy.submit(this.form)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: result => {
            this.toaster.success('¡Operación realizada con éxito!', 'Actualizado', {
              timeOut: 3000,
            });
          },
          error: () => this.error = 'Error al guardar el exercicio'
        });

    };
  }

  getItem() {
    this.service.getOne(this.topicId ?? 0).subscribe(topic => {
      this.form = this.strategy.buildForm(topic);
    })
  }

  getBlocksArray(): FormArray {
    let blocks = this.form.get('blocks') as FormArray;
    if (blocks.length === 0) 
      blocks.push(this.createEmptyBlock());
    return blocks;
  }

  submit!: () => void;

  ngOnDestroy() {
  }

  createEmptyBlock() {
    return new FormGroup({
      id: new FormControl(null),
      description: new FormControl('', Validators.required),
      ruleId: new FormControl(null, Validators.required),
      articlesIds: new FormControl([], Validators.required)
    });
  }
}