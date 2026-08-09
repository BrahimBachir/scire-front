import { Injectable } from '@angular/core';
import {
  ICourseStudySchedule,
  IScheduleEvent,
  IScheduleTopicInput,
  ITopicScheduleSummary,
} from '../common/models/interfaces';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffInCalendarDays(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / MS_PER_DAY);
}

/**
 * Splits `total` items as evenly as possible into `buckets` buckets.
 * The first `total % buckets` buckets get one extra item.
 */
function evenBuckets(total: number, buckets: number): number[] {
  if (buckets <= 0) return [];
  const base = Math.floor(total / buckets);
  const remainder = total % buckets;
  return Array.from({ length: buckets }, (_, i) => base + (i < remainder ? 1 : 0));
}

@Injectable({ providedIn: 'root' })
export class StudyScheduleService {
  buildSchedule(
    topics: IScheduleTopicInput[],
    examDate: Date,
    today: Date = new Date()
  ): ICourseStudySchedule {
    const start = startOfDay(today);
    const totalDays = diffInCalendarDays(examDate, start) + 1;
    const totalArticles = topics.reduce((sum, t) => sum + t.articles.length, 0);
    const numTopics = topics.length;

    if (totalDays <= 0) {
      return {
        events: [],
        topicSummaries: [],
        examDate,
        totalDays,
        studyDays: 0,
        totalArticles,
        articlesPerDayAvg: 0,
        insufficientTime: true,
        shortfallDays: Math.abs(totalDays) + 1,
      };
    }

    const studyDays = Math.max(totalDays - numTopics, 1);
    const insufficientTime = totalDays < numTopics;
    const shortfallDays = insufficientTime ? numTopics - totalDays : 0;

    const quota = evenBuckets(totalArticles, studyDays);
    let quotaIndex = 0;
    let remainingInDay = quota[0] ?? 0;

    const events: IScheduleEvent[] = [];
    const topicSummaries: ITopicScheduleSummary[] = [];
    let currentDate = start;

    const advanceDay = () => {
      currentDate = addDays(currentDate, 1);
      quotaIndex++;
      remainingInDay = quota[quotaIndex] ?? 0;
    };

    for (const topic of topics) {
      let topicStartDate: Date | null = null;
      let topicEndDate: Date | null = null;

      for (const article of topic.articles) {
        while (remainingInDay <= 0 && quotaIndex < studyDays - 1) {
          advanceDay();
        }

        if (topicStartDate === null) topicStartDate = currentDate;
        topicEndDate = currentDate;

        events.push({
          type: 'article',
          date: currentDate,
          topicId: topic.id,
          topicName: topic.name,
          articleId: article.id,
          articleTitle: article.title,
        });

        remainingInDay--;
      }

      const startDate = topicStartDate ?? currentDate;
      const endDate = topicEndDate ?? currentDate;
      const testDate = addDays(endDate, 1);

      events.push({
        type: 'topicTest',
        date: testDate,
        topicId: topic.id,
        topicName: topic.name,
      });

      topicSummaries.push({
        topicId: topic.id,
        topicName: topic.name,
        startDate,
        endDate,
        testDate,
        articleCount: topic.articles.length,
      });

      currentDate = addDays(testDate, 1);
      quotaIndex++;
      remainingInDay = quota[quotaIndex] ?? 0;
    }

    return {
      events,
      topicSummaries,
      examDate,
      totalDays,
      studyDays,
      totalArticles,
      articlesPerDayAvg: studyDays > 0 ? totalArticles / studyDays : totalArticles,
      insufficientTime,
      shortfallDays,
    };
  }
}
