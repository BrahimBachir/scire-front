import { Component, Input, OnInit } from '@angular/core';
import { ITestResults } from 'src/app/common/models/interfaces';
import { FormatTimePipe } from 'src/app/common/pipe/time-format.pipe';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-test-results-times',
  standalone: true,
  imports: [MaterialModule, IconModule, FormatTimePipe],
  templateUrl: './times.component.html',
  //styleUrl: './times.component.scss',
})
export class AppTestResultTimesComponent implements OnInit {
  @Input({ required: true }) test: ITestResults;

  constructor() {}

  ngOnInit(): void {
  }

  get time(): number {
    return Number(this.test.time_per_question.title);
  }

  get timeDiff(): number {
    return Number(this.test.time_per_question.difference > 0 ? this.test.time_per_question.difference : this.test.time_per_question.difference * -1);
  }
}
