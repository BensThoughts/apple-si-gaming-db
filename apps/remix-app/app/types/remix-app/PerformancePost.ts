import type {
  RatingTierRank,
  FrameRateTierRank,
  GamepadTierRank,
  TierRank,
  SystemSpec,
} from '~/types';

//  type ExpandRecursively<T> = T extends object
//    ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
//    : T;

//  type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;


export type PerformancePost = {
  performancePostId: number;
  createdAt: string;
  postText: string;
  postHTML?: string;
  serializedLexicalEditorState?: string;
  rating: {
    ratingTierRank: RatingTierRank;
    frameRateTierRank?: FrameRateTierRank;
    frameRateStutters?: boolean;
    gamepadTierRank?: GamepadTierRank;
    gamepadMetadata?: {
      id: number;
      description: string;
    };
  };
  userWhoCreated: {
    steamUserId64: string;
    displayName?: string;
    avatarMedium?: string;
    avatarFull?: string;
  };
  steamApp: {
    steamAppId: number;
    name: string;
    headerImage?: string;
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
    systemSpecId?: SystemSpec['systemSpecId']; // used for editing posts to pre-fill form
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
