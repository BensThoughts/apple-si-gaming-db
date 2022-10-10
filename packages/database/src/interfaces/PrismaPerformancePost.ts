import type {
  PerformancePost,
  RatingMedal,
  FrameRate,
} from '@prisma/client';

export {
  PerformancePost,
  RatingMedal,
  FrameRate,
};

export type PerformancePostWithoutMetadata =
  Partial<Omit<PerformancePost, 'id' | 'updatedAt' | 'createdAt'>> &
  Pick<PerformancePost, 'steamAppId' | 'steamUserId'>;
