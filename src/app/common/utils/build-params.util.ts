import { HttpParams } from '@angular/common/http';
import { IQueryingDto } from '../models/interfaces';

export function buildParams(queryingDto: IQueryingDto, params: HttpParams): HttpParams {
    if (queryingDto.skip && queryingDto.skip > 0)
        params = params.append('skip', queryingDto.skip);

    if (queryingDto.take && queryingDto.take > 0)
        params = params.append('take', queryingDto.take);

    if (queryingDto.searchTerm && queryingDto.searchTerm.trim() !== '')
        params = params.append('searchTerm', queryingDto.searchTerm.trim());

    if (queryingDto.parentId && queryingDto.parentId > 0)
        params = params.append('parentId', queryingDto.parentId);

    if (queryingDto.ruleAmbitId && queryingDto.ruleAmbitId > 0)
        params = params.append('ruleAmbitId', queryingDto.ruleAmbitId);

    if (queryingDto.ruleId && queryingDto.ruleId > 0)
        params = params.append('ruleId', queryingDto.ruleId);
    
    if (queryingDto.ruleTypeId && queryingDto.ruleTypeId > 0)
        params = params.append('ruleTypeId', queryingDto.ruleTypeId);

    if (queryingDto.ruleGazetteId && queryingDto.ruleGazetteId > 0)
        params = params.append('ruleGazetteId', queryingDto.ruleGazetteId);

    if (queryingDto.ruleCode && queryingDto.ruleCode.trim() !== '')
        params = params.append('ruleCode', queryingDto.ruleCode.trim());

    if (queryingDto.maxDifficulty && queryingDto.maxDifficulty > 0)
        params = params.append('maxDifficulty', queryingDto.maxDifficulty);

    if (queryingDto.minDifficulty && queryingDto.minDifficulty >= 0)
        params = params.append('minDifficulty', queryingDto.minDifficulty);

    if (queryingDto.featureId && queryingDto.featureId >= 0)
        params = params.append('featureId', queryingDto.featureId);

    if (queryingDto.type && queryingDto.type.trim() !== '')
      params = params.append('type', queryingDto.type.trim());

    if (queryingDto.allParentIds && queryingDto.allParentIds.length > 0)
        params = params.append('allParentIds', queryingDto.allParentIds.join(','));
    
    if (queryingDto.startDate)
        params = params.append('startDate', queryingDto.startDate.toString());

    if (queryingDto.endDate)
        params = params.append('endDate', queryingDto.endDate.toString());

    if (queryingDto.voteType && queryingDto.voteType.trim() !== '')
      params = params.append('voteType', queryingDto.voteType.trim());

    if (queryingDto.featureType && queryingDto.featureType.trim() !== '')
      params = params.append('featureType', queryingDto.featureType.trim());

    if (queryingDto.direction && queryingDto.direction.trim() !== '')
      params = params.append('direction', queryingDto.direction.trim());

    if (queryingDto.flashcardId && queryingDto.flashcardId >= 0)
        params = params.append('flashcardId', queryingDto.flashcardId);

    if (queryingDto.videoId && queryingDto.videoId >= 0)
        params = params.append('videoId', queryingDto.videoId);

    if (queryingDto.diagramId && queryingDto.diagramId >= 0)
        params = params.append('diagramId', queryingDto.diagramId);

    if (queryingDto.questionId && queryingDto.questionId >= 0)
        params = params.append('questionId', queryingDto.questionId);

    if (queryingDto.noteId && queryingDto.noteId >= 0)
        params = params.append('noteId', queryingDto.noteId);

    if (queryingDto.courseCategoryId && queryingDto.courseCategoryId >= 0)
        params = params.append('courseCategoryId', queryingDto.courseCategoryId);

    if (queryingDto.courseTypeId && queryingDto.courseTypeId >= 0)
        params = params.append('courseTypeId', queryingDto.courseTypeId);

    if (queryingDto.callerId && queryingDto.callerId >= 0)
        params = params.append('callerId', queryingDto.callerId);

    if (queryingDto.favorite !== undefined && queryingDto.favorite !== null)
        params = params.append('favorite', ''+queryingDto.favorite);

    if (queryingDto.userId && queryingDto.userId >= 0)
        params = params.append('userId', queryingDto.userId);

    if (queryingDto.topicId && queryingDto.topicId >= 0)
        params = params.append('topicId', queryingDto.topicId);

    if (queryingDto.blockId && queryingDto.blockId >= 0)
        params = params.append('blockId', queryingDto.blockId);

    if (queryingDto.courseId && queryingDto.courseId >= 0)
        params = params.append('courseId', queryingDto.courseId);

    if (queryingDto.articleId && queryingDto.articleId >= 0)
        params = params.append('articleId', queryingDto.articleId);

    return params;
}
