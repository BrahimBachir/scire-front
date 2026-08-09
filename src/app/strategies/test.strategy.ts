import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ITest, ITestQuestion } from '../common/models/interfaces';
import { cleanObject } from '../common/utils';
import { TestService } from '../services';

@Injectable()
export class TestStrategy {
  constructor(private service: TestService) {}

  buildForm(courseId: number, test?: ITest): FormGroup {
    return new FormGroup({
      id: new FormControl(test?.id || null),
      num_questions: new FormControl(
        test?.num_questions ?? null,
        Validators.required,
      ),
      typeId: new FormControl(test?.typeId || null, Validators.required),
      categoryId: new FormControl(
        test?.categoryId || null,
        Validators.required,
      ),
      timed: new FormControl(test?.timed || false),
      topicsIds: new FormControl<number[]>(
        test?.topicsIds ?? [],
        Validators.required,
      ),

      creatorId: new FormControl(test?.creatorId || null),
      sectionId: new FormControl(test?.sectionId || null),
      courseId: new FormControl(
        (test?.courseId ?? courseId) || null,
        Validators.required,
      ),
      difficultyId: new FormControl(
        test?.difficultyId || null,
        Validators.required,
      ),
      exerciseId: new FormControl(
        test?.exerciseId || null,
        Validators.required,
      ),

      time_allowed: new FormControl(test?.time_allowed || null),
      time_consumed: new FormControl(test?.time_consumed || null),
      completed: new FormControl(test?.completed || false),
    });
  }

  submit(form: FormGroup): Observable<ITest> {
    const value = cleanObject(form.getRawValue()) as ITest;
    return value.id ? this.service.update(value) : this.service.create(value);
  }
}
