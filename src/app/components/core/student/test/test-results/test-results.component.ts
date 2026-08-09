import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TestService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { IBasicDataItem, ITest, ITestResults } from 'src/app/common/models/interfaces';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTestResultsBasicComponent } from './basic-numbers/basic-numbers.component';
import { AppTestResultsBasicPieComponent } from './basic-pie/basic-pie.component';
import { AppTestResultPercentageComponent } from './percentaje/percentage.component';
import { FormatTimePipe } from 'src/app/common/pipe/time-format.pipe';
import { AppSalesPredictionComponent } from "./test-score/test-score.component";
import { AppTestResultDifferenceComponent } from "./difference/difference.component";
import { AppTestResultTimesComponent } from "./times/times.component";
@Component({
  selector: 'app-test-simulator',
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
    AppTestResultsBasicComponent,
    AppTestResultsBasicPieComponent,
    AppTestResultPercentageComponent,
    AppSalesPredictionComponent,
    AppTestResultDifferenceComponent,
    AppTestResultTimesComponent
],
  templateUrl: './test-results.component.html',
  styleUrl: './test-results.component.scss',
})
export class AppTestResultsComponent implements OnInit {
  private service = inject(TestService);
  private route = inject(ActivatedRoute);

  testId = Number(this.route.snapshot.paramMap.get('testId')) || null;

  courseId = Number(this.route.snapshot.paramMap.get('courseId')) || null;
  test!: ITestResults;

  constructor() {}

  ngOnInit(): void {
    this.loadItem();
  }

  loadItem() {
    this.service.getResults(this.testId ?? 0, this.courseId ?? 0).subscribe({
      next: (test) => {
        this.test = test;
      },
      error: (error) => console.error(error),
    });
  }
}