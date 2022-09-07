import type {
  PerformancePost,
} from '@prisma/client';

export {
  PerformancePost,
};

export type PerformancePostWithoutMetadata =
  Partial<Omit<PerformancePost, 'id' | 'updatedAt' | 'createdAt'>> &
  Pick<PerformancePost, 'steamAppId' | 'steamUserId'>;
