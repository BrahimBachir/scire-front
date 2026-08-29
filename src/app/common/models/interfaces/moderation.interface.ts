export type ModeratableFeatureType = 'QUESTION' | 'VIDEO' | 'DIAGRAM' | 'FLASHCARD';

export interface IModerationReaction {
  id: number;
  feedbackText: string | null;
  authorName: string | null;
  isRead: boolean;
}

export interface IModerationQueueItem {
  id: number;
  featureType: ModeratableFeatureType;
  summary: string;
  creator: { id: number; name: string; email: string | null } | null;
  dislikeCount: number;
  reactions: IModerationReaction[];
}
