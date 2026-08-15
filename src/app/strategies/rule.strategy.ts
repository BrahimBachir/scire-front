import { Injectable } from "@angular/core";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { Observable } from "rxjs";
import { cleanObject } from "../common/utils";
import { LegislationService } from "../services";
import { formatToISODate } from "../common/utils/parse-date.util";
import { IRule, IArticle, IRuleIndex } from "../common/models/interfaces";
import * as uuid from 'uuid';

@Injectable()
export class RuleStrategy {

  constructor(private service: LegislationService) { }

  buildForm(rule?: IRule): FormGroup {
    return new FormGroup({
      id: new FormControl(rule?.id ?? null),
      code: new FormControl(rule?.code ?? ''),
      description: new FormControl(rule?.description ?? ''),
      internal: new FormControl(rule?.internal ?? false),
      repealed: new FormControl(rule?.repealed ?? false),
      updateDate: new FormControl(rule?.updateDate ?? null),
      enactmentDate: new FormControl(rule?.enactmentDate ?? null),
      repealDate: new FormControl(rule?.repealDate ?? null),
      effectiveDate: new FormControl(rule?.effectiveDate ?? null),
      typeId: new FormControl(rule?.typeId ?? null),
      gazetteId: new FormControl(rule?.gazetteId ?? null),
      ambitId: new FormControl(rule?.ambitId ?? null),
      fromBOE: new FormControl(rule?.fromBOE ?? false),

      articles: new FormArray(
        (rule?.articles || []).map(article => {
          return new FormGroup({
            id: new FormControl(article.id),
            boeId: new FormControl(article.boeId ?? ''),
            description: new FormControl(article.description),
            book: new FormControl(article.book ?? ''),
            title: new FormControl(article.title ?? ''),
            chapter: new FormControl(article.chapter ?? ''),
            section: new FormControl(article.section ?? ''),
            subsection: new FormControl(article.subsection ?? ''),
            content: new FormControl(article.content ?? ''),
            repealed: new FormControl(article.repealed ?? false),
            lastUpdate: new FormControl(article.lastUpdate ?? null),

          })
        })
      ),
      boeIndex: new FormArray(
        (rule?.boeIndex || []).map(index => {
          return new FormGroup({
            id: new FormControl(index?.id ?? null),
            titulo: new FormControl(index?.titulo ?? ''),
            fecha_actualizacion: new FormControl(index?.fecha_actualizacion ?? null),
            url: new FormControl(index?.url ?? ''),
          })
        })
      )
    });
  }

  buildBOEIndex(articles: IArticle[]): IRuleIndex[] {
    if (!articles || articles.length === 0) {
      return [];
    }
    return articles.map(article => ({
      id: article.boeId ?? '',
      titulo: article.description,
    }));
  }

  submit(
    form: FormGroup,
  ): Observable<IRule> {
    const rawValue = form.getRawValue();

    const formattedValue = {
      ...rawValue,
      updateDate: rawValue.updateDate ? formatToISODate(rawValue.updateDate) : undefined,
      enactmentDate: rawValue.enactmentDate ? formatToISODate(rawValue.enactmentDate) : undefined,
      effectiveDate: rawValue.effectiveDate ? formatToISODate(rawValue.effectiveDate) : undefined,
      repealDate: rawValue.repealDate ? formatToISODate(rawValue.repealDate) : undefined,
    };

    const cleanValue = cleanObject(formattedValue) as IRule;

    cleanValue.articles?.map(article => { 
      article.boeId = article.boeId || uuid.v4();
      return article;
    });

    if (!formattedValue.fromBOE) {
      cleanValue.boeIndex = this.buildBOEIndex(cleanValue.articles || []);
    }

    return cleanValue.id
      ? this.service.updateRule(cleanValue)
      : this.service.createRule(cleanValue);
  }
}
