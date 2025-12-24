import { HttpParams } from '@angular/common/http';
import { QueryingDto } from '../models/interfaces';

export function buildParams(queryingDto: QueryingDto, params: HttpParams): HttpParams {
    if (queryingDto.skip && queryingDto.skip > 0)
        params = params.append('skip', queryingDto.skip);

    if (queryingDto.take && queryingDto.take > 0)
        params = params.append('take', queryingDto.take);

    if (queryingDto.searchTerm && queryingDto.searchTerm.trim() !== '')
        params = params.append('searchTerm', queryingDto.searchTerm.trim());

    if (queryingDto.parentId && queryingDto.parentId > 0)
        params = params.append('parentId', queryingDto.parentId);

    if (queryingDto.ruleAmbit && queryingDto.ruleAmbit > 0)
        params = params.append('ruleAmbit', queryingDto.ruleAmbit);

    if (queryingDto.ruleType && queryingDto.ruleType > 0)
        params = params.append('ruleType', queryingDto.ruleType);

    if (queryingDto.ruleGazette && queryingDto.ruleGazette > 0)
        params = params.append('ruleGazette', queryingDto.ruleGazette);

    if (queryingDto.ruleCode && queryingDto.ruleCode.trim() !== '')
        params = params.append('ruleCode', queryingDto.ruleCode.trim());

    if (queryingDto.artiCode && queryingDto.artiCode.trim() !== '')
        params = params.append('artiCode', queryingDto.artiCode.trim());

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

    if (queryingDto.schemeId && queryingDto.schemeId >= 0)
        params = params.append('schemeId', queryingDto.schemeId);

    if (queryingDto.questionId && queryingDto.questionId >= 0)
        params = params.append('questionId', queryingDto.questionId);

    if (queryingDto.noteId && queryingDto.noteId >= 0)
        params = params.append('noteId', queryingDto.noteId);

    return params;
}
