import type {
  PerformancePost,
} from '@prisma/client';

export type PrismaPerformancePost =
  Partial<Omit<PerformancePost, 'id' | 'updatedAt' | 'createdAt'>> &
  Pick<PerformancePost, 'steamAppId' | 'steamUserId'>;
