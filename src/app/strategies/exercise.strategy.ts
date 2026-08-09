import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IExercise } from '../common/models/interfaces';
import { cleanObject } from '../common/utils';
import { ExerciseService } from '../services/exercise.service';

@Injectable()
export class ExerciseStrategy {
  constructor(private service: ExerciseService) {}

  buildForm(exercise?: IExercise, courseId?: number): FormGroup {
    return new FormGroup({
      id: new FormControl(exercise?.id ?? null),
      code: new FormControl(exercise?.code ?? null),
      description: new FormControl(
        exercise?.description ?? '',
        Validators.required,
      ),
      typeId: new FormControl(exercise?.typeId || null, Validators.required),
      questions_number: new FormControl(
        exercise?.questions_number || 0,
        Validators.min(1),
      ),
      time_per_question: new FormControl(
        exercise?.time_per_question || null,
        Validators.min(1),
      ), // Default 30s
      questionsTypeId: new FormControl(
        exercise?.questionsTypeId || null,
        Validators.required,
      ),
      generalQuestNum: new FormControl(
        exercise?.generalQuestNum || 0,
        Validators.required,
      ),
      specificQuestNum: new FormControl(
        exercise?.specificQuestNum || 0,
        Validators.required,
      ),
      penalty: new FormControl(exercise?.penalty || 0, ),
      totalPoints: new FormControl(exercise?.totalPoints || null, [
        Validators.required,
        Validators.min(1),
      ]),
      pointsToPass: new FormControl(exercise?.pointsToPass || null, [
        Validators.required,
        Validators.min(1),
      ]),
      courseId: new FormControl(exercise?.courseId || courseId),
    });
  }

  submit(form: FormGroup): Observable<IExercise> {
    const value = cleanObject(form.value) as IExercise;

    return value.id ? this.service.update(value) : this.service.create(value);
  }
}
