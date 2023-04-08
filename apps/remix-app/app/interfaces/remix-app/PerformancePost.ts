import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
  TierRank,
  SystemSpec,
} from '~/interfaces';

//  type ExpandRecursively<T> = T extends object
//    ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
//    : T;

//  type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;


export type PerformancePost = {
  performancePostId: number;
  createdAt: string;
  postText: string;
  rating: {
    ratingTierRank: RatingTierRank;
    frameRateTierRank?: FrameRateTierRank | null;
    frameRateStutters?: boolean | null;
    gamepadTierRank?: GamepadTierRank | null;
    gamepadMetadata?: {
      id: number;
      description: string;
    } | null;
  };
  userWhoCreated: {
    steamUserId64: string;
    displayName?: string | null;
    avatarMedium?: string | null;
    avatarFull?: string | null;
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
    manufacturer: SystemSpec['manufacturer'];
    model: SystemSpec['model'];
    osVersion: SystemSpec['osVersion'];
    cpuBrand: SystemSpec['cpuBrand'];
    videoDriver: SystemSpec['videoDriver'];
    videoDriverVersion: SystemSpec['videoDriverVersion'];
    videoPrimaryVRAM: SystemSpec['videoPrimaryVRAM'];
    memoryRAM: SystemSpec['memoryRAM'];
    systemSpecId?: SystemSpec['systemSpecId'] | null; // used for editing posts to pre-fill form
  };
  numLikes: number;
}


export type PerformancePostForNewPostsCard = {
  performancePostId: number;
  postText: string;
  userWhoCreated: {
    displayName?: string | null;
    avatarFull?: string | null;
  }
  steamApp: {
    steamAppId: number;
    name: string;
  }
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

export type AveragePerformancePostRating = {
  avgRatingTierRank?: RatingTierRank;
  avgFrameRateTierRank?: FrameRateTierRank;
  percentPostsWhereFrameRateStutters: number | null;
  frameRateStuttersTierRank: TierRank;
  avgGamepadTierRank?: GamepadTierRank;
}
