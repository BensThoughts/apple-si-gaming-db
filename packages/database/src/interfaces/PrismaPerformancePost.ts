import type {
  PerformancePost,
  // RatingMedal,
} from '@prisma/client';

export {
  PerformancePost,
  // RatingMedal,
};

export type PerformancePostWithoutMetadata =
  Partial<Omit<PerformancePost, 'id' | 'updatedAt' | 'createdAt'>> &
  Pick<PerformancePost, 'steamAppId' | 'steamUserId'>;
