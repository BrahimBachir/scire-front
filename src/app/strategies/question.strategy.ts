import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { IQuestion } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { singleCorrectAnswerValidator } from "../common/utils/single-correct-answer.util";
import { QuestionService } from "../services";
import { FeatureStrategy } from ".";

@Injectable()
export class QuestionStrategy  implements FeatureStrategy<IQuestion> {

  constructor(private service: QuestionService) {}

  buildForm(question?: IQuestion): FormGroup {
    return new FormGroup({
      id: new FormControl(question?.id ?? null),
      text: new FormControl(question?.text ?? '', Validators.required),
      explanation: new FormControl(question?.explanation ?? '', Validators.required),
      real: new FormControl(question?.real ?? false),
      difficultyId: new FormControl(question?.difficultyId ?? 1, Validators.required),//this.fb.control<number | null>(1),


      answers: new FormArray(
        (question?.answers ?? Array(4).fill(null)).map(a =>
          new FormGroup({
            id: new FormControl(a?.id ?? null),
            text: new FormControl(a?.text ?? '', Validators.required),
            isCorrect: new FormControl(a?.isCorrect ?? false)
          })
        ),
        { validators: singleCorrectAnswerValidator }
      )
    });
  }

submit(
  featureForm: FormGroup,
  commonForm: FormGroup
): Observable<IQuestion> {

  const value = cleanObject(featureForm.value) as IQuestion;
  
  //value.ruleId = commonForm.value.ruleId;
  value.articlesIds = commonForm.value.articlesIds ?? [];
  console.log(value)

  return value.id
    ? this.service.update(value)
    : this.service.create(value);
}
}
