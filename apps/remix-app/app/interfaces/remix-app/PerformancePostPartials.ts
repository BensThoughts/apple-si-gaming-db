import type { RatingMedal } from '../database';

export interface PerformancePostBrief {
  id: string;
  steamAppId: number;
  steamApp: {
    name: string;
  };
  postText: string;
  displayName: string | null;
  avatarMedium: string | null;
  ratingMedal: RatingMedal;
}
