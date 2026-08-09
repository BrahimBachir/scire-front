import { Component, Input, OnInit } from '@angular/core';
import { ITestResults } from 'src/app/common/models/interfaces';
import { FormatTimePipe } from 'src/app/common/pipe/time-format.pipe';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-test-results-difference',
  standalone: true,
  imports: [MaterialModule, IconModule],
  templateUrl: './difference.component.html',
  //styleUrl: './difference.component.scss',
})
export class AppTestResultDifferenceComponent implements OnInit {
  @Input({ required: true }) test: ITestResults;

  totalQuestions: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.totalQuestions = Number(
      this.test.data_items.find((i) => i.code === 'TQ')?.title,
    );
  }

  get data_items() {
    return this.test.data_items ?? [];
  }

  get time(): number {
    return Number(this.test.time_per_question.difference);
  }
}
