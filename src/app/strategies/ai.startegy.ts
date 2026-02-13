import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Observable } from "rxjs";
import { AIGeneration, IBlock, IFlashcard, IQuestion, IDiagram, ITopic, ITopicCourse } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { AIService } from "../services";

@Injectable()
export class AIStrategy {

  constructor(private service: AIService) { }

  buildForm(element: AIGeneration): FormGroup {
    return new FormGroup({
      ruleId: new FormControl<number | null>(element.ruleId || null, Validators.required),
      articlesIds: new FormControl<number[]>(element.articlesIds ?? [], Validators.required),
      featureType: new FormControl<string>(element.featureType ?? '', Validators.required),
    });
  }

  submit(
    form: FormGroup,
  ): Observable<IFlashcard[] | IDiagram[] | IQuestion[]> {

    const value = cleanObject(form.value) as AIGeneration;

    console.log("Topic to be saved/updated at strategy: ", value)

    return this.service.generateElement(value); 
  }
}
