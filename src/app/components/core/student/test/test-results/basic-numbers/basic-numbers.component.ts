import {
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TestService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { IBasicDataItem } from 'src/app/common/models/interfaces';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-test-results-basic',
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    NgScrollbarModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    MatSliderModule,
  ],
  templateUrl: './basic-numbers.component.html',
})
export class AppTestResultsBasicComponent {
  @Input({ required: true }) data_items: IBasicDataItem[];
}