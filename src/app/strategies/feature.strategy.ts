import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { IFlashcard, INote, IQuestion, IDiagram, IVideo } from "../common/models/interfaces";

export interface FeatureStrategy<T = any> {
  buildForm(element?: IQuestion | INote | IFlashcard | IDiagram | IVideo ): FormGroup;
  submit(form: FormGroup, commonForm: FormGroup): Observable<T>;
}