import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatureFormComponent } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

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
    IconModule,
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
