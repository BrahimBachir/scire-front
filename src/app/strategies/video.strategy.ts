import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { IVideo } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { VideoService } from "../services";
import { FeatureStrategy } from ".";

@Injectable()
export class VideoStrategy  implements FeatureStrategy<IVideo> {

  constructor(private service: VideoService) {}

  buildForm(video?: IVideo): FormGroup {
    return new FormGroup({
      id: new FormControl(video?.id ?? null),
      code: new FormControl(video?.code ?? '', Validators.required),
      description: new FormControl(video?.description ?? '', Validators.required),
      startSeconds: new FormControl(video?.startSeconds ?? null, Validators.required),
      endSeconds: new FormControl(video?.endSeconds ?? null, Validators.required),
    });
  }

submit(
  featureForm: FormGroup,
  commonForm: FormGroup
): Observable<IVideo> {

  const value = cleanObject(featureForm.value) as IVideo;
  
  value.articlesIds = commonForm.value.articlesIds ?? [];
  console.log(value)

  return value.id
    ? this.service.update(value)
    : this.service.create(value);
}
}
