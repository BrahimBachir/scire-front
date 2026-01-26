import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { cleanObject } from "../common/utils";
import { SchemeService } from "../services";
import { FeatureStrategy } from ".";
import { IScheme } from "../common/models/interfaces";

@Injectable()
export class SchemeStrategy  implements FeatureStrategy<IScheme> {

  constructor(private service: SchemeService) {}

  buildForm(scheme?: IScheme): FormGroup {
    return new FormGroup({
      id: new FormControl(scheme?.id ?? null),
      snippet: new FormControl(scheme?.snippet ?? '', Validators.required),
      description: new FormControl(scheme?.description ?? '', Validators.required),    });
  }

submit(
  featureForm: FormGroup,
  commonForm: FormGroup
): Observable<IScheme> {
  const payload: IScheme = {
      ...cleanObject(featureForm.value),
      ruleId: commonForm.value.ruleId,
      articlesIds: commonForm.value.articlesIds,
    };

  //const value = cleanObject(featureForm.value) as IScheme;
  
  //value.articlesIds = commonForm.value.articlesIds ?? [];
  //console.log(value)

  return payload.id
    ? this.service.update(payload)
    : this.service.create(payload);
}
}
