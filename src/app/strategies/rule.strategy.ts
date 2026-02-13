import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { IRule } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { LegislationService } from "../services";

@Injectable()
export class RuleStrategy {

  constructor(private service: LegislationService) { }

  buildForm(rule?: IRule): FormGroup {
    return new FormGroup({
      id: new FormControl(rule?.id ?? null),
      code: new FormControl(rule?.code ?? ''),
      description: new FormControl(rule?.description ?? ''),
      lastArticle: new FormControl(rule?.lastArticle ?? ''),
      internal: new FormControl(rule?.internal ?? false),
      repealed: new FormControl(rule?.repealed ?? false),
      articles: new FormArray(
        (rule?.articles ?? []).map(a => new FormGroup({
          id: new FormControl(a.id ?? null),
          boeId: new FormControl(a.boeId ?? ''),
          description: new FormControl(a.description ?? ''),
          title: new FormControl(a.title ?? ''),
          repealed: new FormControl(a.repealed ?? false),
          lastUpdate: new FormControl(a.lastUpdate ?? null),

        }))
      ),
      // TODO: Generate BOE INDEX in the back from the articles Array and remove this from the form 
      /* boeIndex: new FormArray((rule?.boeIndex ?? []).map(a => new FormGroup({
        id: new FormControl(a.id ?? null),
        titulo: new FormControl(a.titulo ?? ''),
        fecha_actualizacion: new FormControl(a.fecha_actualizacion ?? ''),
        url: new FormControl(a.url ?? ''),
        ruleCode: new FormControl(a.ruleCode ?? ''),
      }))), */
      updateDate: new FormControl(rule?.updateDate ?? null),
      enactmentDate: new FormControl(rule?.enactmentDate ?? null),
      repealDate: new FormControl(rule?.repealDate ?? null),
      effectiveDate: new FormControl(rule?.effectiveDate ?? null),
      typeId: new FormControl(rule?.typeId ?? null),
      gazetteId: new FormControl(rule?.gazetteId ?? null),
      ambitId: new FormControl(rule?.ambitId ?? null),
      readingTime: new FormControl(rule?.readingTime ?? 0),
    });
  }

  submit(
    form: FormGroup,
  ): Observable<IRule> {

    const value = cleanObject(form.value) as IRule;

    //value.ruleId = commonForm.value.ruleId;
    return value.id
      ? this.service.updateRule(value)
      : this.service.createRule(value);
  }
}
