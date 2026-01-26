import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, model, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IRule, IArticle, IVideo, FeatureFormComponent } from 'src/app/common/models/interfaces';
import { cleanObject } from 'src/app/common/utils';
import { MaterialModule } from 'src/app/material.module';
import { VideoService } from 'src/app/services';

@Component({
  selector: 'app-video-create-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MaterialModule,
    MatExpansionModule,
    MatButtonModule,
    TablerIconsModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoFormComponent implements FeatureFormComponent {
    @Input({ required: true }) form!: FormGroup;

}
/* export class VideoFormComponent implements OnInit, OnChanges {
  private service = inject(VideoService)
  video = model<IVideo | null>(null);
  @Input() rule = signal<IRule | null>(null);
  @Input() article = signal<IArticle | null>(null);

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  videoForm = new FormGroup({
    id: new FormControl<number | null>(null),
    code: new FormControl<string>('', Validators.required),
    startSeconds: new FormControl<number | null>(null),
    endSeconds: new FormControl<number | null>(null),
  })

  ngOnInit(): void {
    const v = this.video();

    if(v) {
      this.videoForm.patchValue({
        id: v.id,
        code: v.code,
        startSeconds: v.startSeconds,
        endSeconds: v.endSeconds,
      });
    }
  }

  get f() {
    return this.videoForm.controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }

  save() {
    const v = this.video();
    const rule = this.rule();
    const article = this.article;
    let newV = cleanObject(this.videoForm.value) as IVideo;
    if(v) newV.id = v.id;
    newV.article = article()?.boeId || '';
    newV.ruleId = rule?.id  || undefined;

    this.video.set(newV)
    if (newV.id) this.update();
    else this.create();
  }

  create() {
    const q = this.video();
    
    if(q) this.service.create(q).subscribe((saved => {
      this.video.set(saved);
      this.closeDialog.emit();
    }));
  }

  update() {
    const q = this.video();
    
    if(q) this.service.update(q).subscribe((saved => {
      this.video.set(saved);
      this.closeDialog.emit();
    }));
  }
} */
