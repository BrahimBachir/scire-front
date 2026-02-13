import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { cleanObject } from "../common/utils";
import { FlashcardService } from "../services";
import { FeatureStrategy } from ".";
import { IFlashcard } from "../common/models/interfaces";

@Injectable()
export class FlashcardStrategy implements FeatureStrategy<IFlashcard> {

  constructor(private service: FlashcardService) { }

  buildForm(flashcard?: IFlashcard): FormGroup {
    return new FormGroup({
      id: new FormControl(flashcard?.id ?? null),
      question: new FormControl(flashcard?.question ?? '', Validators.required),
      answer: new FormControl(flashcard?.answer ?? '', Validators.required),
      creationTypeId: new FormControl(flashcard?.creationTypeId ?? null)
    });
  }

  submit(
    featureForm: FormGroup,
    commonForm: FormGroup
  ): Observable<IFlashcard> {

    const value = cleanObject(featureForm.value) as IFlashcard;

    value.articlesIds = commonForm.value.articlesIds ?? [];
    console.log(value)

    return value.id
      ? this.service.update(value)
      : this.service.create(value);
  }
}
