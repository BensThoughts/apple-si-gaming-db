import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces/database';

/*
  These are the Performance Post interfaces for the frontend. The shape of the
  data in the db is slightly different than it is on the front end.
*/

// export interface PerformancePostBrief {
//   id: string;
//   steamApp: {
//     steamAppId: number;
//   };
//   postText: string;
//   userWhoCreatedPost: {

//   }
//   displayName: string | null;
//   avatarMedium: string | null;
//   ratingMedal: RatingMedal;
// }

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

export interface PerformancePost {
    postId: string;
    createdAt: Date;
    userWhoCreatedPost?: {
      steamUserId: string;
      displayName?: string | null;
      avatarMedium?: string | null;
    };
    postText: string;
    numLikes: number;
    postTags?: {
      postTagId: number;
      description: string;
    }[];
    rating: PerformancePostRating;
    steamApp: {
      steamAppId: number;
      name: string;
      headerImage?: string | null;
    };
    system?: {
      manufacturer?: string | null;
      model?: string | null;
      osVersion?: string | null;
      cpuBrand?: string | null;
      videoDriver?: string | null;
      videoDriverVersion?: string | null;
      videoPrimaryVRAM?: string | null;
      memoryRAM?: string | null;
    }
}
