import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { AppCourseModerationComponent } from './course-moderation.component';
import { AppFeatureModerationComponent } from './feature-moderation.component';

@Component({
  selector: 'app-moderation',
  imports: [
    CommonModule,
    MaterialModule,
    AppCourseModerationComponent,
    AppFeatureModerationComponent,
  ],
  templateUrl: './moderation.component.html',
})
export class AppModerationComponent { }
