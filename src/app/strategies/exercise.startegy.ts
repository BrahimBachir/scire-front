import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { IExercise } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { ExerciseService } from "../services/exercise.service";

@Injectable()
export class ExerciseStrategy {

  constructor(private service: ExerciseService) { }

  buildForm(exercise?: IExercise, courseId?: number): FormGroup {
    return new FormGroup({
      id: new FormControl(exercise?.id ?? null),
      code: new FormControl(exercise?.code ?? null),
      description: new FormControl(exercise?.description ?? '', Validators.required),
      typeId: new FormControl(exercise?.typeId || null, Validators.required),
      questionCount: new FormControl(exercise?.questionCount || 0, Validators.min(1)),
      timePerQuestion: new FormControl(exercise?.timePerQuestion || null, Validators.min(1)), // Default 30s
      questionsTypeId: new FormControl(exercise?.questionsTypeId || null, Validators.required),
      generalQuestNum: new FormControl(exercise?.generalQuestNum || null, Validators.required),
      specificQuestNum: new FormControl(exercise?.specificQuestNum || null, Validators.required),
      penaltyPerWrongAnswer: new FormControl(exercise?.penaltyPerWrongAnswer || 0, [Validators.required, Validators.min(1)]),
      totalPoints: new FormControl(exercise?.totalPoints || null, [Validators.required, Validators.min(1)]),
      pointsToPass: new FormControl(exercise?.pointsToPass || null, [Validators.required, Validators.min(1)]),
      courseId: new FormControl(exercise?.courseId || courseId),
    });
  }

  submit(
    form: FormGroup,
  ): Observable<IExercise> {

    const value = cleanObject(form.value) as IExercise;

    return value.id
      ? this.service.update(value)
      : this.service.create(value);
  }
}
