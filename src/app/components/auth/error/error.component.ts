import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { IllustrationComponent } from 'src/app/illustrations/illustrations.component';
@Component({
  selector: 'app-error',
  imports: [
    RouterModule,
    MaterialModule,
    MatButtonModule,
    IllustrationComponent,
  ],
  templateUrl: './error.component.html',
})
export class AppErrorComponent {}
