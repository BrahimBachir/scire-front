import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { CreateDialogData, INote } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { singleCorrectAnswerValidator } from "../common/utils/single-correct-answer.util";
import { NoteService } from "../services";
import { FeatureStrategy } from ".";

@Injectable()
export class NoteStrategy  implements FeatureStrategy<INote> {

  constructor(private service: NoteService) {}

  buildForm(question?: INote): FormGroup {
    return new FormGroup({
      id: new FormControl(question?.id ?? null),
      content: new FormControl(question?.content ?? '', Validators.required),
      color: new FormControl(question?.color ?? '', Validators.required),
      favorite: new FormControl(question?.favorite ?? false),
    });
  }

submit(
  featureForm: FormGroup,
  commonForm: FormGroup
): Observable<INote> {

  const value = cleanObject(featureForm.value) as INote;

  //value.ruleId = commonForm.value.ruleId;
  value.articlesIds = commonForm.value.articlesIds ?? [];
  value.courseId = commonForm.value.courseId;
  console.log(value)

  return value.id
    ? this.service.update(value)
    : this.service.create(value);
}
}
