import type {
  PerformancePost,
  RatingMedal,
  FrameRate,
  PostTag,
} from '@prisma/client';

export type {
  PerformancePost,
  RatingMedal,
  FrameRate,
  PostTag,
};

export type PerformancePostWithoutMetadata =
  Partial<Omit<PerformancePost, 'id' | 'updatedAt' | 'createdAt'>> &
  Pick<PerformancePost, 'steamAppId' | 'steamUserId'>;
