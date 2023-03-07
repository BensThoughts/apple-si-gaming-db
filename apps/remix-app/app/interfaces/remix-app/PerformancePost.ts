import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces/database';

export type PerformancePost = {
  performancePostId: number;
  createdAt: Date;
  postText: string;
  rating: {
    ratingMedal: RatingMedal;
    frameRateAverage?: FrameRate | null;
    frameRateStutters?: boolean | null;
    gamepadRating?: GamepadRating | null;
    gamepadMetadata?: {
      id: number;
      description: string;
    } | null;
  };
  userWhoCreated: {
    steamUserId64: string;
    displayName?: string | null;
    avatarMedium?: string | null;
  };
  steamApp: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
  };
  postTags: {
    id: number;
    description: string;
  }[];
  systemSpec: {
    manufacturer?: string | null;
    model?: string | null;
    osVersion?: string | null;
    cpuBrand?: string | null;
    videoDriver?: string | null;
    videoDriverVersion?: string | null;
    videoPrimaryVRAM?: string | null;
    memoryRAM?: string | null;
    systemSpecId?: number | null;
  };
  numLikes: number;
}

export interface GamepadOption {
  id: number;
  description: string;
}

export interface PostTagOption {
  id: number;
  description: string;
}

export interface SystemSpecOption {
  id: number;
  systemName: string;
}


/*
  These are the Universal Performance Post interfaces for the frontend. The shape of the
  data in the db is slightly different than it is on the front end.
  PerformancePostBase & {...} is used to build out the needed portions of
  a performance post throughout the app depending on the front end components
  data needs.  For example, some components need the rating, others do not.
*/
// export type PerformancePostBase = {
//   performancePostId: number;
//   createdAt: Date;
//   postText: string;
// }

// export type PerformancePostRating = {
//   ratingMedal: RatingMedal;
//   frameRateAverage?: FrameRate | null;
//   frameRateStutters?: boolean | null;
//   gamepadRating?: GamepadRating | null;
//   gamepadMetadata?: {
//     id: number;
//     description: string;
//   } | null;
// }

// export interface PerformancePostSystem {
//   manufacturer?: string | null;
//   model?: string | null;
//   osVersion?: string | null;
//   cpuBrand?: string | null;
//   videoDriver?: string | null;
//   videoDriverVersion?: string | null;
//   videoPrimaryVRAM?: string | null;
//   memoryRAM?: string | null;
//   systemSpecId?: number | null;
// }

// export interface PerformancePostSteamApp {
//   steamAppId: number;
//   name: string;
//   headerImage?: string | null;
// }

// export interface PerformancePostUserWhoCreated {
//   steamUserId64: string;
//   displayName?: string | null;
//   avatarMedium?: string | null;
// }

// export interface PerformancePostTag {
//   id: number;
//   description: string;
// }

// export interface PerformancePostLikes {
//   numLikes: number;
// }
