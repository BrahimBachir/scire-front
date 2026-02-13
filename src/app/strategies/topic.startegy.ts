import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Observable } from "rxjs";
import { IBlock, ITopic, ITopicCourse } from "../common/models/interfaces";
import { cleanObject } from "../common/utils";
import { TopicService } from "../services/topic.service";

@Injectable()
export class TopicStrategy {

  constructor(private service: TopicService) { }

  buildForm(topic?: ITopic, courseId?: number): FormGroup {
    return new FormGroup({
      id: new FormControl(topic?.id ?? null),
      code: new FormControl(topic?.code ?? null),
      description: new FormControl(topic?.description ?? '', Validators.required),
      name: new FormControl(topic?.name ?? '', Validators.required),
      categoryId: new FormControl(topic?.section?.categoryId ?? null),
      sectionId: new FormControl(topic?.sectionId ?? null),
      courseId: new FormControl(topic?.courseId ?? courseId),

      blocks: new FormArray(
        (topic?.blocks ?? []).map(b => this.buildBlockGroup(b))
      )
    });
  }

  buildBlockGroup(b?: IBlock): FormGroup {
    return new FormGroup({
      id: new FormControl(b?.id ?? null),
      description: new FormControl(b?.description ?? '', Validators.required),
      ruleId: new FormControl<number | null>(b?.ruleId ?? null, Validators.required),
      articlesIds: new FormControl<number[]>(b?.articlesIds ?? [], Validators.required),
    });
  }

  buildCourseTopicForm(topicId?: number, courseId?: number): FormGroup {
    return new FormGroup({
      categoryId: new FormControl(null),
      sectionId: new FormControl(null),
      topicId: new FormControl(topicId ?? null, Validators.required),
      courseId: new FormControl(courseId ?? null, Validators.required),
    });
  }

  submit(
    form: FormGroup,
  ): Observable<ITopic | ITopicCourse> {
    const { categoryId, ...rest } = form.value;

    const value = cleanObject(rest) as ITopic;

    return value.id
      ? this.service.update(value)
      : this.service.create(value);
  }

  addToCourse(
    form: FormGroup,
  ): Observable<ITopicCourse> {
    const value = cleanObject(form.value) as ITopicCourse;
    console.log("Add to course method at strategy: ", value)
    return this.service.addToCourse({ topicId: value?.topicId, courseId: value?.courseId ?? 0 })
  }
}
