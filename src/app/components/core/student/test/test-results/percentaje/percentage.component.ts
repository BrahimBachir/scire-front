import { Component, Input, OnInit } from '@angular/core';
import { ITestResults } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-test-results-percentages',
  standalone: true,
  imports: [MaterialModule, IconModule ],
  templateUrl: './percentage.component.html',
  //styleUrl: './percentage.component.scss',
})
export class AppTestResultPercentageComponent implements OnInit {
  @Input({ required: true }) test: ITestResults;

  totalQuestions: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.totalQuestions = Number(
      this.test.data_items.find((i) => i.code === 'TQ')?.title,
    );
  }

  getPercentage(total: number | string): number {
    if (!total) return 0;

    return Math.floor((Number(total) / this.totalQuestions) * 100);
  }

  get data_items() {
    return this.test?.data_items ?? [];
  }

  get time(): number {
    return Number(this.test.time_per_question.title);
  }
}
