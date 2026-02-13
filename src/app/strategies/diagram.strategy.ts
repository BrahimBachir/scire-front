import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { cleanObject } from "../common/utils";
import { DiagramService } from "../services";
import { IDiagram } from "../common/models/interfaces";

@Injectable()
export class DiagramStrategy {
  constructor(private service: DiagramService) { }

  buildForm(diagram?: IDiagram): FormGroup {
    return new FormGroup({
      id: new FormControl(diagram?.id ?? null),
      snippet: new FormControl(diagram?.snippet ?? '', Validators.required),
      description: new FormControl(diagram?.description ?? '', Validators.required),
      ruleId: new FormControl<number | null>(diagram?.ruleId ?? null, Validators.required),
      articlesIds: new FormControl<number[]>(diagram?.articlesIds ?? [], Validators.required),
      creationTypeId: new FormControl(diagram?.creationTypeId ?? null)
    });
  }

  submit(
    form: FormGroup,
  ): Observable<IDiagram> {
    const payload: IDiagram = {
      ...cleanObject(form.value),
    };

    return payload.id
      ? this.service.update(payload)
      : this.service.create(payload);
  }
}
