import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces/database';

/*
  These are the Universal Performance Post interfaces for the frontend. The shape of the
  data in the db is slightly different than it is on the front end.
  PerformancePostBase & {...} is used to build out the needed portions of
  a performance post throughout the app depending on the front end components
  data needs.  For example, some components need the rating, others do not.
*/

export interface PerformancePostRating {
  ratingMedal: RatingMedal;
  frameRateAverage?: FrameRate | null;
  frameRateStutters?: boolean | null;
  gamepadRating?: GamepadRating | null;
  gamepadMetadata?: {
    gamepadId: number;
    description: string;
  } | null,
}

export interface PerformancePostSystem {
  manufacturer?: string | null;
  model?: string | null;
  osVersion?: string | null;
  cpuBrand?: string | null;
  videoDriver?: string | null;
  videoDriverVersion?: string | null;
  videoPrimaryVRAM?: string | null;
  memoryRAM?: string | null;
}

export interface PerformancePostSteamApp {
  steamAppId: number;
  name: string;
  headerImage?: string | null;
}

export interface PerformancePostUserWhoCreated {
  steamUserId: string;
  displayName?: string | null;
  avatarMedium?: string | null;
}

export interface PerformancePostTag {
  postTagId: number;
  description: string;
}

export interface PerformancePostLikes {
  numLikes: number;
}

export interface PerformancePostBase {
    postId: string;
    createdAt: Date;
    postText: string;
}

// export interface PerformancePostBrief {
//   id: string;
//   steamApp: {
//     steamAppId: number;
//     name: string;
//   };
//   postText: string;
//   displayName: string | null;
//   avatarMedium: string | null;
//   ratingMedal: RatingMedal;
// }
