import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { IArticlesFeatures, IVideo } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { VideoService } from "../services";

@Injectable()
export class VideoStrategy {

  constructor(private service: VideoService) { }

  buildForm(video?: IVideo): FormGroup {
    const form = new FormGroup({
      id: new FormControl(video?.id ?? null),
      code: new FormControl(video?.code ?? '', Validators.required),
      ruleId: new FormControl(video?.ruleId ?? null, Validators.required),
      description: new FormControl(video?.description ?? ''),

      articles_features: new FormArray(
        (video?.articles_features ?? []).map(af => this.buildArticlesFeatures(af))
      )
    });

/*     let af = form.get('articles_features') as FormArray;
    if (af.length === 0) 
      af.push(this.buildArticlesFeatures()); */
    return form;
  }

  buildArticlesFeatures(af?: IArticlesFeatures): FormGroup {
    return new FormGroup({
      id: new FormControl(af?.id ?? null),
      articleId: new FormControl(af?.articleId ?? null, Validators.required),
      startSeconds: new FormControl(af?.startSeconds ?? null),
      endSeconds: new FormControl(af?.endSeconds ?? null),
    });
  }

  submit(
    form: FormGroup,
  ): Observable<IVideo> {
    const afs: IArticlesFeatures[] = [];

    const value = cleanObject(form.value) as IVideo;
    console.log(value)

      value.articles_features?.map((af) => {
        const newAF = Object.fromEntries(
          Object.entries(af)
            .filter(([_, v]) => v !== null)
        );

        afs.push(newAF as IArticlesFeatures);
      });

    let { description, ...payload} = value;

    payload = {
      ...payload,
      articles_features: afs
    }

    return payload.id
      ? this.service.update(payload)
      : this.service.create(payload);
  }
}
